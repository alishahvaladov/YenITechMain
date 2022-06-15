const loading = document.querySelector(".loading");
const holidaySelect = document.querySelector("#holidaySelect");
const submitBtn = document.querySelector("#submitBtn");
const holidayStartDateInput = document.querySelector("#holidayStartDate");
const holidayEndDateInput = document.querySelector("#holidayEndDate");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");

const renderPage = () => {
    $.get(`http://localhost:3000/api/holidays/all?offset=0`, (res) => {
        const holidays = res.holidays;
        const holidayDates = res.holidayDates;
        let count = res.count[0].count;
        count = Math.ceil(parseInt(count) / 10);
        if (count <= 1) {
            pagination.classList.add("d-none");
        }
        selectOptions = `
            <option hidden>Bayram Gününü Seçin</option>
        `;
        holidays.forEach(holiday => {
            selectOptions += `
                <option value=${holiday.id}>${holiday.name}</option>
            `;
        });
        let tbodyHTML = ``;
        holidayDates.forEach(date => {
            tbodyHTML += `
                <tr>
                    <td>${date.name}</td>
                    <td>${date.holiday_date}</td>
                </tr>
            `;
        });
        tbody.innerHTML = tbodyHTML;
        holidaySelect.innerHTML = selectOptions;
    });
    loading.classList.add("d-none");
}

submitBtn.addEventListener("click", () => {
    const data = {};
    data.holidayStartDate = holidayStartDateInput.value;
    data.holidayEndDate = holidayEndDateInput.value;
    data.holidayID = holidaySelect.value;
    
    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/holidays/add/holiday-date`,
        data: data,
        success: ((res) => {
            console.log(res);
        })
    }).catch((err) => {
        console.log(err);
    });
});

setTimeout(renderPage, 1000);