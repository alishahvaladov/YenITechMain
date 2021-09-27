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
   let seconds = dateTime.getSeconds();
   timeElem.innerHTML = `${hours}:${minutes}:${seconds}`;
}


setInterval(getTime, 1000);
getTime();
let dateElem = document.querySelector("#date");

dateElem.innerHTML = `${day} ${month}`;

// $(document).ready(function () {
//    $(".empRmBtn").on('click', function () {
//       $('.modal-remove').toggleClass('show-modal')
//    });
// });

let empRemoveBtn = $(".empRmBtn");

empRemoveBtn.each(function (index) {
   $(this).on("click", () => {
      console.log($(this).parent().children('div.modal-remove'));
      $(this).parent().children('div.modal-remove').toggleClass("show-modal");
   });
});

// empRemoveBtn.forEach(item => {
//    let parent = item.parentNode;
//    let children = parent.childNodes;
//    let myModalDiv;
//
//    for (let i = 0; i < children.length; i++) {
//       if(children[i].className == "modal-remove") {
//          myModalDiv = children[i];
//       }
//    }
//    console.log(myModalDiv);
//    // let rmBtns = document.querySelectorAll('.modal-remove');
//    // document.addEventListener('click', (event) => {
//    //    rmBtns.forEach(item => {
//    //       if(event.target !==  item && !event.target.contains(myModalDiv) && !event.target.classList.contains('empRmBtn') && !event.target.classList.contains('bi-dash-circle')) {
//    //          myModalDiv.style.display = 'none';
//    //       }
//    //    });
//    // });
// });