const loading = document.querySelector(".loading");
const holidaySelect = document.querySelector("#holidaySelect");
const submitBtn = document.querySelector("#submitBtn");
const holidayStartDateInput = document.querySelector("#holidayStartDate");
const holidayEndDateInput = document.querySelector("#holidayEndDate");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");

const paginationFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    pgItems.forEach(item => {
        item.addEventListener("click", () => {
            loading.classList.remove('d-none');
            let offset = item.value;
            let activeClass = document.querySelector('.pagination-active');
            let index = pgItems.indexOf(activeClass);
            pgItems[index].classList.remove('pagination-active');
            item.classList.add('pagination-active');
            activeClass = document.querySelector('.pagination-active');
            index = pgItems.indexOf(activeClass);
            if(pgItems.length > 14) {
                if(index > 9 && index < pgItems.length - 14) {
                fTDots.classList.remove('d-none');
                lTDots.classList.remove('d-none');
                for(let i = 1; i < pgItems.length - 1; i++) {
                    pgItems[i].classList.add('d-none');
                }
                for (let i = index; i > index - 9; i--) {
                    if (i < 1) {
                        break;
                    }
                    pgItems[i].classList.remove('d-none');
                }
                for (let i = index; i < index + 9; i++) {
                    pgItems[i].classList.remove('d-none');
                }
                } else if (index <= 9) {
                fTDots.classList.add('d-none');
                lTDots.classList.remove('d-none');
                for (let i = 21; i < pgItems.length - 2; i++) {
                    pgItems[i].classList.add('d-none')
                }
                for (let i = 1; i < 21; i++) {
                    pgItems[i].classList.remove('d-none');
                }
                } else {
                lTDots.classList.add('d-none');
                fTDots.classList.remove('d-none');
                for (let i = 1; i < pgItems.length - 20; i++) {
                    pgItems[i].classList.add('d-none');
                }
                for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                    pgItems[i].classList.remove('d-none');
                }
                }
            }
            setTimeout(() => {
                $.get(`http://localhost:3000/api/holidays/all?offset=${offset}`, (res) => {
                    let tbodyHTML = ``;
                    const holidayDates = res.holidayDates;
                    holidayDates.forEach(date => {
                        tbodyHTML += `
                            <tr>
                                <td>${date.name}</td>
                                <td>${date.holiday_date}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = tbodyHTML;
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    });
}

const renderPage = () => {
    $.get(`http://localhost:3000/api/holidays/all?offset=0`, (res) => {
        const holidays = res.holidays;
        const holidayDates = res.holidayDates;
        let count = res.count[0].count;
        count = Math.ceil(parseInt(count) / 10);
        if (count <= 1) {
            pagination.classList.add("d-none");
        } else {
            let pgHtml = "";
            for (let i = 1; i <= count; i++) {
                if (i === 1) {
                   pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                   if(count > 21) {
                      pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                   }
                } if (i > 21 && i < count) {
                   pgHtml += `
                        <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                } else if (i !== 1 && i !== count) {
                   pgHtml += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }
                if (i === count) {
                   if (count > 21) {
                      pgHtml += `
                        <button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>
                      `
                   }
                   if (count > 1) {
                      pgHtml += `
                         <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                      `
                   }
                }
            }
            pagination.classList.remove('d-none');
            pgContainer.innerHTML = pgHtml;
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
        loading.classList.add("d-none");
        paginationFunctions();
    });
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
            loading.classList.remove("d-none");
            const successSpan = $("#successSpan");
            const successDiv = $(".holiday-success-message");
            successSpan.html("Bayram günü əlavə olundu");
            successDiv.fadeIn();
            setTimeout(() => {
                successDiv.fadeOut();
                renderPage();
            }, 1000);
        })
    }).catch((err) => {
        const message = err.responseJSON.message;
        const errorSpan = $("#errorSpan");
        const errorDiv = $(".holiday-error-message");
        console.log(errorDiv);
        errorSpan.html(message);
        errorDiv.fadeIn();
        setTimeout(() => {
            errorDiv.fadeOut();
        }, 1000);
    });
});

setTimeout(renderPage, 1000);