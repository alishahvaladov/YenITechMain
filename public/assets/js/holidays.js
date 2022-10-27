const calendarMonths = document.querySelector("#calendarMonths");
const calendarYear = document.querySelector("#calendarYear");
const calendarDates = document.querySelector(".calendar-dates");
const calendarModal = document.querySelector(".calendar-modal");
const calendarDate = new Date();
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
    let firstDayOfDate = new Date(getCalendarYear, calendarMonth, firstDay).getDay();
    const lastDayOfDate = new Date(getCalendarYear, calendarMonth, lastDay).getDay();
    let html = "";
    if (firstDayOfDate !== 0) {
        const countPrevDays = firstDayOfDate - 1;
        if (countPrevDays !== 0) {
            for (i = countPrevDays - 1; i >= 0; i--) {
                html += `
                    <div class="calendar-date-item prevMonth">
                        <span>${new Date(getCalendarYear, calendarMonth, -1 * i).getDate()}</span>
                    </div>
                `;
            }
        }
        
    } else {
        for (i = 5; i >= 0; i--) {
            html += `
                <div class="calendar-date-item prevMonth">
                    <span>${new Date(getCalendarYear, calendarMonth, -1 * i).getDate()}</span>
                </div>
            `;
        }
    }

    for (i = firstDay; i <= lastDay; i++) {
        if (new Date(getCalendarYear, calendarMonth, i).getDay() === 6 || new Date(getCalendarYear, calendarMonth, i).getDay() === 0) {
            html += `
                <div class="calendar-date-item weekend-days">
                    <span>${i}</span>
                </div>
            `;
        } else {
            html += `
                <div class="calendar-date-item">
                    <span>${i}</span>
                </div>
            `;
        }
        
        // console.log(new Date(year, month, i).getDay());
    }


    if (lastDayOfDate !== 0) {
        const countNextDays = 7 - lastDayOfDate;
        for (let i = 1; i <= countNextDays; i++) {
            html += `
                <div class="calendar-date-item nextMonth">
                    <span>${i}</span>
                </div>
            `;
        }
    }

    calendarDates.innerHTML = html;

    const calendarDateItems = document.querySelectorAll(".calendar-date-item");

    calendarDateItems.forEach(date => {
        date.addEventListener("click", (e) => {
            calendarModal.style.top = `${e.clientY + 15}px`;
            calendarModal.style.left = `${e.clientX + 15}px`;
            calendarModal.classList.remove("d-none");
        });
    });
    saveBtn.addEventListener("click", () => {
        calendarModal.classList.add("d-none");
    });
    loading.classList.add("d-none");
}

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