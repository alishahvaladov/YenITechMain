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
setInterval(getTime, 1000);
getTime();
let dateElem = document.querySelector("#date");
dateElem.innerHTML = `${day} ${month}`;


const fpUploadBtn = document.querySelector("#fpUploadBtn");
const fpModal = document.querySelector(".fprint-modal");
const fpCancelBtn = document.querySelector("#fpCancelBtn");


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

$.get('http://localhost:3000/api/notification', (res) => {
      console.log(res);
});

setInterval(() => {
   $.get('http://localhost:3000/api/notification', (res) => {
      console.log(res);
   });
}, 5000)