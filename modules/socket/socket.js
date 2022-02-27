const { io } = require("socket.io-client");
const socket = io("http://localhost:5002", {
    autoConnect: false
});

module.exports = socket;