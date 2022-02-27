const socket = io("http://localhost:5002");
const notificationAlert = document.querySelector(".notification-alert");

socket.on('new-time-off-notification', (args) => {
    notificationAlert.classList.remove("d-none");
    setTimeout(() => {
       notificationAlert.classList.add("d-none");
    }, 3000);
    console.log(args);
 });