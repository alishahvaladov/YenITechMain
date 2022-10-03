const notificationAlert = document.querySelector(".notification-alert");
const indicator = document.querySelector(".indicator");
const listGroup = document.querySelector(".list-group");
const navAccordion = document.querySelector("#nav_accordion");

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

flatpickr(".month-and-year", {
   plugins: [
      new monthSelectPlugin({
      shorthand: true, //defaults to false
      dateFormat: "m.Y", //defaults to "F Y"
      altFormat: "F Y", //defaults to "F Y",
      })
   ],
   locale: "az"
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
   // const filename = res.filename;
   dropdownUsername.innerHTML = res.username[0].username;
   // avatars.forEach(item => {
   //    item.src = filename;
   // });
});

$.ajax({
   type: "GET",
   url: "http://localhost:3000/api/navbar",
   success: ((result) => {
      const navs = result.result;
      console.log(navs);
      if (navs.length > 0) {
         let navHtml = `
            <li class="sidebar-header" style="padding-top: 0px !important;">
                  Səhifələr
            </li>
         `;
         navs.forEach(nav => {
            if (nav.url && nav.parent_id === null) {
               navHtml += `
                  <li class="sidebar-item ${nav.class}">
                        <a class="sidebar-link" href="${nav.url}">
                           ${nav.icon}
                           <span class="align-middle">${nav.name}</span>
                        </a>
                  </li>
               `;
            } else if(nav.parent_element_id !== null) {
               navHtml += `
                  <li class="sidebar-item has-submenu ${nav.class}">
                     <a class="collapsed sidebar-link" href="#" data-bs-target="${nav.parent_element_id}" aria-expanded="false">
                        ${nav.icon}
                        <span class="align-middle">${nav.name}</span>
                        <i class="fas fa-chevron-down align-middle" style="margin-left: 15px;"></i>
                     </a>
                     <ul id="${nav.parent_element_id}" class="submenu collapse" data-bs-parent="#nav_accordion">
               `;
               navs.forEach(item => {
                  if (item.parent_id === nav.id) {
                     navHtml += `
                        <li class="sidebar-item">
                              <a class="sidebar-link" href="${item.url}">
                                 ${item.icon}
                                 <span class="align-middle">${item.name}</span>
                              </a>
                        </li>
                     `;
                  }
               });

               navHtml += `
                     </ul>
                  </li>
               `
            }
            
         });
         navAccordion.innerHTML = navHtml;

         const sideBarItems = document.querySelectorAll('.sidebar-item');

         const path = window.location.pathname;
         if (path.includes('/dashboard')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               })
               document.querySelector(".dashboard").classList.add('active');
         } else if (path.includes('/employee')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.employees').classList.add('active');
         } else if (path.includes('/all-fprints')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.fprints').classList.add('active');
         } else if (path.includes('/fines')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.fines').classList.add('active');
         } else if (path.includes('/projects')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.projects').classList.add('active');
         } else if (path.includes('/department')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.departments').classList.add('active');
         } else if (path.includes('/positions')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.positions').classList.add('active');
         } else if (path.includes('/users')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.users').classList.add('active');
         } else if (path.includes('/timeoffrequests')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.time-offs').classList.add('active');
         } else if (path.includes('/salaries')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.salaries').classList.add('active');
         } else if (path.includes('/working-hours')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.working-hours').classList.add('active');
         } else if (path.includes('/holidays')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.holidays').classList.add('active');
         } else if (path.includes('/support')) {
               sideBarItems.forEach(item => {
                  item.classList.remove('active');
               });
               document.querySelector('.support').classList.add('active');
         }

         document.querySelectorAll('.sidebar .sidebar-link').forEach(function(element){
               
               element.addEventListener('click', function (e) {

               let nextEl = element.nextElementSibling;
               let parentEl  = element.parentElement

                  if(nextEl) {
                     e.preventDefault();
                     let mycollapse = new bootstrap.Collapse(nextEl);
                     
                     if(nextEl.classList.contains('show')){
                     mycollapse.hide();
                     } else {
                           mycollapse.show();
                           // find other submenus with class=show
                           var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                           // if it exists, then close all of them
                           if(opened_submenu){
                           new bootstrap.Collapse(opened_submenu);
                           }
                     }
                  }
               }); // addEventListener
         }) // forEach
      }
      
   })
}).catch((err) => {
   console.log(err);
});


