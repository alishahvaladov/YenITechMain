const { QueryTypes, Op } = require("sequelize");
const { sequelize, User } = require("../db_config/models");
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
  sendNotification: function (to = requiredArgument(), data, toRole = false, event = "notification") {
    // ! check arguments and their order before using
    if (!io) throw new Error("Socket is not initialized");

    if (toRole) {
      sendToSpecificRole(to).then((users) => {
        const filteredUsers = filterMultipleUsers(users);
        io.to(filteredUsers).emit(event, data);
      });
    } else if (typeof to === "string" || typeof to === "number") {
      io.to(socketUsers.get(parseInt(to))).emit(event, data);
    } else if (Array.isArray(to)) {
      io.to(filterMultipleUsers(to)).emit(event, data);
    }

    createMultipleRecordForDB(data, to, toRole).then((multipleRecord) => {
      addNotification(multipleRecord, (err, res) => {
        if (err) console.log(err);
        // console.log(res);
      });
    });
  },
};

async function sendToSpecificRole(roles) {
  return (
    await sequelize.query(`SELECT id FROM Users WHERE role IN(:roles)`, {
      type: QueryTypes.SELECT,
      logging: false,
      replacements: {
        roles,
      },
    })
  ).map((user) => user.id);
}

async function createMultipleRecordForDB(data, to, isRoleBased = false) {
  const userOrGroupIds = Array.isArray(to) ? to : [to];
  if (isRoleBased) {
    return await handleGroupBasedNotifications(userOrGroupIds, data);
  } else {
    return userOrGroupIds.map((idOrRole) => {
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

async function handleGroupBasedNotifications(roleIds, data) {
  const groupUsers = await User.findAll({
    raw: true,
    attributes: ["id", "role"],
    where: {
      role: roleIds,
    },
  });

  return groupUsers.map((user) => {
    return {
      header: data.header,
      description: data.description,
      created_by: data.created_by,
      url: data.url,
      importance: data.importance,
      belongs_to_role: user.role,
      belongs_to: user.id,
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

function requiredArgument() {
  throw new Error("Argument is required");
}
