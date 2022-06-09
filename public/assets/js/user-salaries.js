const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pgContainer = document.querySelector(".pagination-container");
const exportToExcelBtn = document.querySelector("#exportToExcel");
let qSalaryMin = document.querySelector("#qSalaryMin");
let qSalaryMax = document.querySelector("#qSalaryMax");
let qSalaryDate = document.querySelector("#qSalaryDate");

const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    pgItems.forEach(item => {
        item.addEventListener("click", () => {
            loading.classList.remove('d-none');
            let offset = parseInt(item.value) - 1;
            let activeClass = document.querySelector('.pagination-active');
            let index = pgItems.indexOf(activeClass);
            pgItems[index].classList.remove('pagination-active');
            item.classList.add('pagination-active');
            activeClass = document.querySelector('.pagination-active');
            index = pgItems.indexOf(activeClass);
            if(pgItems.length > 21) {
                if(index > 9 && index < pgItems.length - 10) {
                    fTDots.classList.remove('d-none');
                    lTDots.classList.remove('d-none');
                    for(let i = 1; i < pgItems.length - 1; i++) {
                        pgItems[i].classList.add('d-none');
                    }
                    for (let i = index; i > index - 9; i--) {
                        if (i < 1) {
                            break;
                        }
                        pgItems[i].classList.remove('d-none')
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
                $.post(`http://localhost:3000/api/profile/salaries/${offset}`, {
                    qMin: qSalaryMin.value,
                    qMax: qSalaryMax.value,
                    qDate: qSalaryDate.value
                }, (res) => {
                    let up = "";
                    let html = "";
                    const salaries = res.salaries;
                    salaries.forEach(item => {
                        html += `
                            <tr>
                                <td>
                                    ${item.salary_cost}
                                </td>
                                <td>
                                    ${item.salary_date}
                                </td>
                                <td></td>
                            </tr>
                        `
                    });
                    tbody.innerHTML = html;
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    });
}

const search = () => {
    $.post(`http://localhost:3000/api/profile/salaries/0`, {
        qMin: qSalaryMin.value,
        qMax: qSalaryMax.value,
        qDate: qSalaryDate.value
    }, (res) => {
        const salaries = res.salaries;
        let count = res.count[0].count;
        count = Math.ceil(count / 15);
        let html = "";
        salaries.forEach(item => {
            html += `
                <tr>
                    <td>
                        ${item.salary_cost}
                    </td>
                    <td>
                        ${item.salary_date}
                    </td>
                    <td></td>
                </tr>
            `
        });
        tbody.innerHTML = html;

        let countHtml = "";

        for (let i = 1; i <= count; i++) {
            if (i === 1) {
                countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                countHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
            }
            if (i > 21 && i < count) {
                countHtml += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            } else if (i !== 1 && i !== count) {
                countHtml += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            }
            if (i === count) {
                if(count > 21) {
                    countHtml += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                }
                if (count !== 1) {
                    countHtml += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }
            }
        }
        pgContainer.innerHTML = countHtml;

        pageFunctions();
    });
}

const renderPage = () => {
    $.post(`http://localhost:3000/api/profile/salaries/0`, {
        qMin: "",
        qMax: "",
        qDate: ""
    }, (res) => {
        const salaries = res.salaries;
        let count = res.count[0].count;
        count = Math.ceil(count / 15);
        let html = "";
        salaries.forEach(item => {
            html += `
                <tr>
                    <td>
                        ${item.salary_cost}
                    </td>
                    <td>
                        ${item.salary_date}
                    </td>
                    <td></td>
                </tr>
            `
        });
        tbody.innerHTML = html;

        let countHtml = "";

        for (let i = 1; i <= count; i++) {
            if (i === 1) {
                countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                countHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
            }
            if (i > 21 && i < count) {
                countHtml += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            } else if (i !== 1 && i !== count) {
                countHtml += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            }
            if (i === count) {
                if(count > 21) {
                    countHtml += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                }
                if (count !== 1) {
                    countHtml += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }
            }
        }
        pgContainer.innerHTML = countHtml;
        loading.classList.add('d-none');
        pageFunctions();
    });
}

const exportToExcel = () => {
    const method = "post";
    const params = {
        qMin: qSalaryMin.value,
        qMax: qSalaryMax.value,
        qDate: qSalaryDate.value
    }
    let form = document.createElement('form');
    form.setAttribute("method", method);
    form.setAttribute("action", "http://localhost:3000/api/profile/export/salary");

    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);
            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}



exportToExcelBtn.addEventListener("click", exportToExcel);

setTimeout(renderPage, 1000);

qSalaryMin.addEventListener("keyup", search);
qSalaryMax.addEventListener("keyup", search);
qSalaryDate.addEventListener("change", search);