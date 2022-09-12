const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const exportBtn = document.querySelector('#export');
const empInput = document.querySelector("#emp");
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const resetDate = document.querySelector("#resetDate");
const pgContainer = document.querySelector(".pagination-container");
const dateNow = new Date();
const year = dateNow.getFullYear();
const salaryDate = document.querySelector("#qSalaryDate");

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
                const emp = empInput.value;
                const min = minInput.value;
                const max = maxInput.value;
                const month = monthSelect.value;
                const year = yearSelect.value;
                $.post(`http://localhost:3000/api/salary/search-salary-by-months`, {
                    emp,
                    min,
                    max,
                    month,
                    year,
                    offset
                }, (res) => {
                    let up = "";
                    let html = "";
                    const salaries = res.result.salaries;
                    salaries.forEach(salary => {
                        if (salary.unofficial_pay === null) {
                            up = '<span class="text-danger">Yoxdur</span>'
                        } else {
                            up = salary.unofficial_pay;
                        }
                        html += `
                            <tr>
                                <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                                <td>${salary.salary_cost}</td>
                                <td>${salary.salary_date}</td>
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
    const emp = empInput.value;
    const min = minInput.value;
    const max = maxInput.value;
    const qSalaryDate = salaryDate.value;
    const offset = 0;
    let html = "";
    $.post('http://localhost:3000/api/salary/search-salary-by-months', {
        emp,
        min,
        max,
        qSalaryDate,
        offset
    }, (sRes) => {
        const salaries = sRes.result.salaries;
        let count = sRes.result.count[0].count;
        count = Math.ceil(count) / 15;
        salaries.forEach(salary => {
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${salary.salary_cost}</td>
                    <td>${salary.salary_date}</td>
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
    $.get('http://localhost:3000/api/salary/salary-by-months/0', (res) => {
        const result = res.result.salaries;
        let count = res.result.count[0].count;
        count = Math.ceil(count / 15);
        let html = "";
        result.forEach(salary => {
            html += ` 
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${salary.salary_cost}</td>
                    <td>${salary.salary_date}</td>
                    <td></td>
                </tr>
            ` 
        });
        tbody.innerHTML = html;
        loading.classList.add('d-none');

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
    exportBtn.addEventListener('click', () => {
        let method = 'get';
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/api/salary/export-to-excel");
        document.body.appendChild(form);
        form.submit();
    });
    empInput.addEventListener('keyup', () => {
        search();
    });
    minInput.addEventListener('keyup', () => {
        search();
    });
    maxInput.addEventListener('keyup', () => {
        search();
    });

    salaryDate.addEventListener('change', () => {
        search();
    });
    
    resetDate.addEventListener("click", () => {
        salaryDate.value = "";
        search();
    });
}

setTimeout(renderPage, 1000)