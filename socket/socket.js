const socketUsers = {};

let io;
module.exports = {
  init: function (server) {
    io = require("socket.io")(server);
    return io;
  },
  createSocketUser: function (userId, socketId) {
    socketUsers[userId] = socketId;
    console.log(socketUsers);
  },
  removeSocketUser: function (userId) {
    delete socketUsers[userId];
  },
  sendNotification: function (to = requiredArgument(), event, data) {
    if (!io) throw new Error("Socket is not initialized");
    io.to(Array.isArray(to) ? filterMultipleUsers(to) : socketUsers[to]).emit(event, data);
  },
};

function requiredArgument() {
  throw new Error("Argument is required");
}

function filterMultipleUsers(users) {
  const filteredUsers = [];
  for (let [key, value] of Object.entries(socketUsers)) {
    users.includes(key) && filteredUsers.push(value);
  }
  return filteredUsers;
}
