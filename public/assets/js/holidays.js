const calendarMonths = document.querySelector("#calendarMonths");
const calendarYear = document.querySelector("#calendarYear");
const calendarDates = document.querySelector(".calendar-dates");
const calendarModal = document.querySelector(".calendar-modal");
const calendarDate = new Date();
const selectedDateText = document.querySelector(".selected-day-text");
const selectedWorkDayStatus = document.querySelector("#workTypeSelect");
const saveBtn = document.querySelector("#saveBtn");
const loading = document.querySelector(".loading");
let calendarMonth = calendarDate.getMonth();
let getCalendarYear = calendarDate.getFullYear();
calendarYear.value = getCalendarYear;
calendarMonths.options[calendarMonth].selected = true;

let html = "";

const renderCalendar = (selected_month = null, written_year = null) => {
    if (selected_month !== null) {
        calendarMonth = selected_month;
    }

    if(written_year !== null) {
        getCalendarYear = written_year;
    }
    const firstDay = new Date(getCalendarYear, calendarMonth, 1).getDate();
    const lastDay = new Date(getCalendarYear, parseInt(calendarMonth) + 1, 0).getDate();
    let firstDayOfDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth), firstDay).getDay();
    const lastDayOfDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth), lastDay).getDay();
    let html = "";
    if (firstDayOfDate !== 0) {
        const countPrevDays = firstDayOfDate - 1;
        if (countPrevDays !== 0) {
            for (i = countPrevDays - 1; i >= 0; i--) {
                let prevMonthDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth), -1 * i);
                html += `
                    <div class="calendar-date-item prevMonth" data-date="${prevMonthDate.getFullYear()}-${(`0${prevMonthDate.getMonth() + 1}`).slice(-2)}-${(`0${prevMonthDate.getDate()}`).slice(-2)}">
                        <span class="date-data-item">${prevMonthDate.getDate()}</span>
                    </div>
                `;
            }
        } 
    } else {
        for (i = 5; i >= 0; i--) {
            let prevMonthDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth), -1 * i);
            const prevMonthFullDate = `${prevMonthDate.getFullYear()}-${(`0${prevMonthDate.getMonth() + 1}`).slice(-2)}-${(`0${prevMonthDate.getDate()}`).slice(-2)}`;

            html += `
                <div class="calendar-date-item prevMonth" data-date="${prevMonthFullDate}"">
                    <span class="date-data-item">${prevMonthDate.getDate()}</span>
                </div>
            `;
        }
    }

    for (i = firstDay; i <= lastDay; i++) {
        let currentMonthDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth), i);
        const currentFullDate = `${currentMonthDate.getFullYear()}-${(`0${currentMonthDate.getMonth() + 1}`).slice(-2)}-${(`0${currentMonthDate.getDate()}`).slice(-2)}`;
            html += `
                <div class="calendar-date-item" data-date="${currentFullDate}">
                    <span class="date-data-item">${i}</span>
                </div>
            `;
        // console.log(new Date(year, month, i).getDay());
    }


    if (lastDayOfDate !== 0) {
        const countNextDays = 7 - lastDayOfDate;
        for (let i = 1; i <= countNextDays; i++) {
            const nextMonthDate = new Date(parseInt(getCalendarYear), parseInt(calendarMonth) + 1, i);
            const nextMonthFullDate = `${nextMonthDate.getFullYear()}-${(`0${nextMonthDate.getMonth() + 1}`).slice(-2)}-${(`0${nextMonthDate.getDate()}`).slice(-2)}`;
            html += `
                <div class="calendar-date-item nextMonth" data-date="${nextMonthFullDate}"">
                    <span class="date-data-item">${i}</span>
                </div>
            `;
        }
    }

    calendarDates.innerHTML = html;

    const calendarDateItems = document.querySelectorAll(".calendar-date-item");
    const selectedDayText = document.querySelector(".selected-day-text");


    calendarDateItems.forEach(date => {
        date.addEventListener("click", (e) => {
            const clickedDate = date.getAttribute("data-date");
            selectedDayText.innerHTML = clickedDate;

            $.get(`/api/calendar/date?date=${clickedDate}`, (res) => {
                const selectedDate = res.selectedDate[0];
                const status = selectedDate.status;
                const workTypeSelector = document.querySelector("#workTypeSelect");
                const options = Array.from(document.querySelector("#workTypeSelect").options);
                options.forEach((option, i) => {
                    if (option.value == status) {
                        workTypeSelector.selectedIndex = i;
                    }
                });
            });

            calendarModal.style.top = `${e.clientY + 15}px`;
            calendarModal.style.left = `${e.clientX + 15}px`;
            calendarModal.classList.remove("d-none");
        });
    });

    document.addEventListener("click", (event) => {
        if (!event.target.className.includes("date-data-item") &&
        !event.target.className.includes("calendar-date-item") &&
        !event.target.className.includes("calendar-modal") && 
        !event.target.className.includes("calendar-modal-container") && 
        !event.target.className.includes("selected-day") && 
        !event.target.className.includes("selected-day-text") &&
        !event.target.className.includes("work-type-select") &&
        !event.target.id.includes("workTypeSelect") && 
        !event.target.id.includes("saveBtn")) {
            calendarModal.classList.add("d-none");
        }
    })

    const dateDataItems = document.querySelectorAll(".date-data-item");

    $.get(`/api/calendar?startDate=${calendarDateItems[0].dataset.date}&endDate=${calendarDateItems[calendarDateItems.length - 1].dataset.date}`, (res) => {
        const calendars = res.calendar;
        calendars.forEach(calendar => {
            calendarDateItems.forEach(item => {
                const dataDate = item.getAttribute("data-date");
                if (calendar.status === 0) {
                    if (dataDate === calendar.date) {
                        item.classList.add("weekend-days");
                    }
                }
                if (calendar.status === 2) {
                    if (dataDate === calendar.date) {
                        item.classList.add("holidays");
                    }
                }
            });
        });
    });


    loading.classList.add("d-none");
}

saveBtn.addEventListener("click", () => {
    const status = selectedWorkDayStatus.value;
    const date = selectedDateText.innerHTML;
    $.post(`/api/calendar/update`, {
        date,
        status
    }, (res) => {
        renderCalendar();
    });
    calendarModal.classList.add("d-none");
});

calendarMonths.addEventListener("change", () => {
    const selectedMonth = calendarMonths.value;
    const writtenYear = calendarYear.value;
    renderCalendar(selectedMonth, writtenYear);
});

calendarYear.addEventListener("keyup", () => {
    const writtenYear = calendarYear.value;
    const selectedMonth = calendarMonths.value;
    renderCalendar(selectedMonth, writtenYear);
});

renderCalendar();