const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const empInput = document.querySelector("#emp");
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const pgContainer = document.querySelector(".pagination-container");
const salaryModal = document.querySelector(".salary-data-modal");
const salaryCloseBtn = document.querySelector(".salaryModalCloseBtn");
const salaryCancelBtn = document.querySelector("#salaryEditCancelBtn");
const salaryEditApplyBtn = document.querySelector("#salaryEditApplyBtn");
const uPaySearchInput = document.querySelector("#u_pay");
const grossInput = document.querySelector("#gross");
const uPayInput = document.querySelector("#uPay");


const editSalary = () => {
    const editSalaryBtns = document.querySelectorAll(".edit-salary");
    editSalaryBtns.forEach(item => {
        item.addEventListener("click", () => {
            $.get(`http://localhost:3000/api/salary/get-salary/${item.value}`, (res) => {
                const salary = res.salary[0];
                uPayInput.value = salary.unofficial_pay;
                grossInput.value = salary.gross;
            });
            salaryModal.classList.remove("d-none");
            salaryEditApplyBtn.value = item.value;
        });
    });
}

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
                const uPay = uPaySearchInput.value;
                const min = minInput.value;
                const max = maxInput.value;
                $.post(`http://localhost:3000/api/salary/search`, {
                    emp,
                    uPay,
                    min,
                    max,
                    offset
                }, (res) => {
                    let up = "";
                    let html = "";
                    const salaries = res.result.salaries;
                    console.log(salaries);
                    salaries.forEach(salary => {
                        if (salary.unofficial_pay === null) {
                            up = '<span class="text-danger">Yoxdur</span>'
                        } else {
                            up = salary.unofficial_pay;
                        }
                        html += `
                            <tr>
                                <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                                <td>${up}</td>
                                <td>${salary.gross}</td>
                                <td class="text-center"><button class="btn btn-outline-secondary edit-salary" value="${salary.id}"><i class="bi bi-pencil"></i></button></td>
                            </tr>
                        `
                    });
                    tbody.innerHTML = html;
                    loading.classList.add('d-none');
                    editSalary();
                });
            }, 1000);
        });
    });
}

const search = () => {
    const emp = empInput.value;
    const uPay = uPaySearchInput.value;
    const min = minInput.value;
    const max = maxInput.value;
    const offset = 0;
    let html = "";
    $.post('http://localhost:3000/api/salary/search', {
        emp,
        uPay,
        min,
        max,
        offset
    }, (sRes) => {
        let up = "";
        const salaries = sRes.result.salaries;
        let count = sRes.result.count[0].count;
        count = Math.ceil(count / 15);
        salaries.forEach(salary => {
            if (salary.unofficial_pay === null) {
                up = '<span class="text-danger">Yoxdur</span>'
            } else {
                up = salary.unofficial_pay;
            }
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${up}</td>
                    <td>${salary.gross}</td>
                    <td class="text-center"><button class="btn btn-outline-secondary edit-salary" value="${salary.id}"><i class="bi bi-pencil"></i></button></td>
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
        editSalary();
        pageFunctions();
    });
}

const renderPage = () => {
    $.get('http://localhost:3000/api/salary/all/0', (res) => {
        const result = res.result.salaries;
        let html = '';
        let count = res.result.count[0].count;
        count = Math.ceil(count / 15);
        result.forEach(salary => {
            let up;
            if (salary.unofficial_pay === null) {
                up = '<span class="text-danger">Yoxdur</span>'
            } else {
                up = salary.unofficial_pay;
            }
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${up}</td>
                    <td>${salary.gross}</td>
                    <td class="text-center"><button class="btn btn-outline-secondary edit-salary" value="${salary.id}"><i class="bi bi-pencil"></i></button></td>
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
        editSalary();
        pgContainer.innerHTML = countHtml;
        pageFunctions();
    });

    empInput.addEventListener('keyup', () => {
        search();
    });
    uPaySearchInput.addEventListener('change', () => {
        search();
    });
    maxInput.addEventListener('keyup', () => {
        search();
    });
    minInput.addEventListener('keyup', () => {
        search();
    });
}

salaryCloseBtn.addEventListener('click', () => {
    salaryModal.classList.add("d-none")
});
salaryCancelBtn.addEventListener('click', () => {
    salaryModal.classList.add("d-none")
});
salaryEditApplyBtn.addEventListener("click", () => {
    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/salary/update/${salaryEditApplyBtn.value}`,
        data: {
            uPay: uPayInput.value,
            gross: grossInput.value
        },
        success: (res) => {
            loading.classList.remove("d-none");
            salaryModal.classList.add("d-none");
            setTimeout(renderPage, 1000);
        }
    }).catch((err) => {
        loading.classList.remove("d-none");
        salaryModal.classList.add("d-none");
        setTimeout(renderPage, 1000);
    });
})

setTimeout(renderPage, 1000);