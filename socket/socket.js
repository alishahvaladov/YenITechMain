const { QueryTypes } = require("sequelize");
const { sequelize, UserAccessGroup } = require("../db_config/models");
const { addNotification } = require("../notification/service");

const socketUsers = new Map();

let io;
module.exports = {
  init: function (server) {
    io = require("socket.io")(server);
    return io;
  },
  createSocketUser: function (userId, socketId) {
    socketUsers.set(userId, socketId);
    getTotalOnlineUserCount();
  },
  removeSocketUser: function (userId) {
    socketUsers.delete(userId);
    getTotalOnlineUserCount();
  },
  /**
   * Send notification to user or groups of users
   * @param {number | number[]} to - User id or array of user ids or group ids
   * @param {{
   *  header: string,
   *  description: string,
   *  created_by: number
   *  belongs_to: number,
   *  belongs_to_role: number,
   *  url: null,
   *  importance: number
   *}} data - Notification data
   * @param {boolean=} [toRole=false] - If true, argument will be treated as group ids, default false
   * @param {string} [event="notification"] - Event name, default is "notification"
   */
  sendNotification: async function (to, data, toRole = false, event = "notification") {
    // ! check arguments and their order before using
    if (!io) throw new Error("Socket is not initialized");

    if (toRole) {
      const groupUsers = await sendToSpecificRole(to);
      const filteredUsers = filterMultipleUsers(groupUsers);
      filteredUsers.length && io.to(filteredUsers).emit(event, data);
      to = groupUsers;
    } else if (typeof to === "string" || typeof to === "number") {
      io.to(socketUsers.get(parseInt(to))).emit(event, data);
    } else if (Array.isArray(to)) {
      const filteredUsers = filterMultipleUsers(to);
      filteredUsers.length && io.to(filteredUsers).emit(event, data);
    }

    const multipleRecord = await createMultipleRecordForDB(data, to, toRole ? to : false);
    addNotification(multipleRecord, (err, res) => {
      if (err) console.log(err);
      // console.log(res);
    });
  },
};

async function sendToSpecificRole(roleIds) {
  return (
    await sequelize.query(
      `
        SELECT Users.id FROM Users
        LEFT JOIN UserAccessGroups ON UserAccessGroups.userId = Users.id
        LEFT JOIN AccessGroups ON AccessGroups.id = UserAccessGroups.AccessGroupId
        WHERE AccessGroups.id IN(:roles)
      `,
      {
        type: QueryTypes.SELECT,
        logging: false,
        replacements: {
          roles: roleIds,
        },
      }
    )
  ).map((user) => user.id);
}

async function createMultipleRecordForDB(data, to, isRoleBased) {
  const userIds = Array.isArray(to) ? to : [to];
  if (isRoleBased) {
    return await handleGroupBasedNotifications(userIds, data);
  } else {
    return userIds.map((idOrRole) => {
      return {
        header: data.header,
        description: data.description,
        created_by: data.created_by,
        url: data.url,
        importance: data.importance,
        belongs_to: idOrRole,
      };
    });
  }
}

async function handleGroupBasedNotifications(groupUsers, data) {
  const groupAndUsers = await UserAccessGroup.findAll({
    raw: true,
    attributes: ["userId", "AccessGroupId"],
    where: {
      userId: groupUsers,
    },
  });

  return groupAndUsers.map((user) => {
    return {
      header: data.header,
      description: data.description,
      created_by: data.created_by,
      url: data.url,
      importance: data.importance,
      belongs_to_role: user.AccessGroupId,
      belongs_to: user.userId,
    };
  });
}

function getTotalOnlineUserCount() {
  const totalOnlineUserCount = socketUsers.size;
  console.log("Total online user count:", totalOnlineUserCount);
  return totalOnlineUserCount;
}

function filterMultipleUsers(users) {
  const filteredUsers = [];
  for (let userId of users) {
    if (socketUsers.has(userId)) {
      filteredUsers.push(socketUsers.get(userId));
    }
  }
  return filteredUsers;
}
