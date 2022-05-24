const notificationAlert = document.querySelector(".notification-alert");
const indicator = document.querySelector(".indicator");
const listGroup = document.querySelector(".list-group");

$(".profile-container").click(() => {
   $(".dropdown-for-profile").fadeToggle(400);
});
flatpickr("input[type='date']", {
   dateFormat: "Y-m-d"
});
flatpickr("input[type='time']", {
   enableTime: true,
   noCalendar: true,
   dateFormat: 'H:i',
   time_24hr: true
});

const monthsAz = {
   0: "Yanvar",
   1: "Fevral",
   2: "Mart",
   3: "Aprel",
   4: "May",
   5: "İyun",
   6: "İyul",
   7: "Avqust",
   8: "Sentyabr",
   9: "Oktyabr",
   10: "Noyabr",
   11: "Dekabr"
}
const date = new Date();
const day = date.getDate();
const monthWN = date.getMonth();
const month = monthsAz[monthWN];
let timeElem = document.querySelector("#time");
const avatars = document.querySelectorAll(".avatar");

let getTime = () => {
   const dateTime = new Date();
   let hours = dateTime.getHours();
   let minutes = dateTime.getMinutes();
   if(minutes.toString().length === 1 ) {
      minutes = "0" + minutes.toString() ;
   }
   let seconds = dateTime.getSeconds();
   timeElem.innerHTML = `${hours}:${minutes}:${seconds}`;
}
// setInterval(getTime, 1000);
// getTime();
// let dateElem = document.querySelector("#date");
// dateElem.innerHTML = `${day} ${month}`;


const fpUploadBtn = document.querySelector("#fpUploadBtn");
const fpModal = document.querySelector(".fprint-modal");
const fpCancelBtn = document.querySelector("#fpCancelBtn");
const dropdownUsername = document.querySelector("#dropdown-username");


if(fpUploadBtn) {
   fpUploadBtn.addEventListener("click", () => {
      fpModal.style.display = "inherit";
   });
}
if(fpCancelBtn) {
   fpCancelBtn.addEventListener("click", () => {
      fpModal.style.display = "none";
   });
}

const getLastNotifications = () => {
   $.get('http://localhost:3000/api/notification/last-notifications', (res) => {
      let listGroupHtml = "";
      const notifications = res.result.notifications;
      const unseenNotificationCount = parseInt(res.result.unseenNotificationCount[0].count);
      if (notifications.length > 0) {
         notifications.forEach(notification => {
            let unseenNotificationBg = "";
            let importance = '';
            if (notification.importance === 1) {
               importance = `<i class="bi bi-bell text-warning" style="font-size: 20px;"></i>`;
            } else {
               importance = `<i class="bi bi-exclamation-circle text-danger" style="font-size: 20px;"></i>`;
            }
            if (parseInt(notification.seen) !== 2) {
               unseenNotificationBg = "background-for-unseen-notification";
            }
            listGroupHtml += `
               <button value="${notification.id}" data-url="${notification.url}" class="list-group-item ${unseenNotificationBg} notofication-button">
                  <div class="row g-0 align-items-center">
                     <div class="col-2">
                        ${importance}
                     </div>
                     <div class="col-10">
                        <div class="text-dark dropdown-text">${notification.header}</div>
                        <div class="text-muted small mt-1 dropdown-text">${notification.description}</div>
                        <div class="text-muted small mt-1 dropdown-text">30m ago</div>
                     </div>
                  </div>
               </button>
            `;
            listGroup.innerHTML = listGroupHtml;
         });
         const notificationBtns = document.querySelectorAll(".notofication-button");
         notificationBtns.forEach(notificationBtn => {
            notificationBtn.addEventListener('click', (e) => {
               const btnId= notificationBtn.value;
               const url = notificationBtn.getAttribute("data-url");
               loading.classList.remove('d-none');
               $.get(`http://localhost:3000/api/notification//update-notification/${btnId}?seen=2`);
               setTimeout(() => {
                  window.location.href = url;
               }, 1000);
            });
         });
      }
      if (unseenNotificationCount > 0) {
         indicator.classList.remove('d-none');
      }
      if(unseenNotificationCount > 0 && unseenNotificationCount <= 4) {
         indicator.innerHTML = unseenNotificationCount;
      } else if (unseenNotificationCount > 4) {
         indicator.innerHTML = "4+";
      }
   })
}
getLastNotifications();

const getNotification = () => {
   $.get('http://localhost:3000/api/notification', (res) => {
      const unseenNotifications = res.unseenNotifications;
      if (res.new_notification === true) {
         notificationAlert.classList.remove('d-none');
         notificationAlert.classList.remove('opacity-hide');
         notificationAlert.classList.add('opacity-show');


         setTimeout(() => {
            notificationAlert.classList.remove('opacity-show');
            notificationAlert.classList.add('opacity-hide');
            setTimeout(() => {
               notificationAlert.classList.add('d-none');
            }, 1000);
         }, 3000);
      }

      if (unseenNotifications && unseenNotifications.length > 0) {
         unseenNotifications.forEach(notification => {
            $.get(`http://localhost:3000/api/notification/update-notification/${notification.id}?seen=1`);
         });
      }
   });
   setTimeout(getLastNotifications, 500);
}

setTimeout(() => {
   getNotification();
   setInterval(getNotification, 5000);
}, 2000);


$.get('http://localhost:3000/api/profile/profile-picture', (res) => {
   console.log(res);
   const filename = res.filename;
   dropdownUsername.innerHTML = res.username[0].username;
   avatars.forEach(item => {
      item.src = filename;
   })
});
