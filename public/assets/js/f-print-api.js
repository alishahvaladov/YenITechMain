const loading = document.querySelector(".loading");
const employeeInput = document.querySelector("#qEmployee");
const projectInput = document.querySelector("#qProject");
const deptInput = document.querySelector("#qDepartment");
const positionInput = document.querySelector("#qPosition");
const minInput = document.querySelector("#qMin");
const maxInput = document.querySelector("#qMax");
const dateInput = document.querySelector("#qDate");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector('.pagination');
const pgContainer = document.querySelector(".pagination-container");

let qEmployee, qProject, qDepartment, qPosition, qMin, qMax, qDate;

const getInputDatas = () => {
    qEmployee = employeeInput.value;
    qProject = projectInput.value;
    qDepartment = deptInput.value;
    qPosition = positionInput.value;
    qMin = minInput.value;
    qMax = maxInput.value;
    qDate = dateInput.value;
}

const pageFuncs = () => {
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
                $.ajax({
                    type: "POST",
                    url: "/api/fprints/fprints",
                    data: {
                        qEmployee,
                        qProject,
                        qDepartment,
                        qPosition,
                        qMin,
                        qMax,
                        qDate,
                        offset
                    },
                    success: ((res) => {
                        const fPrints = res.fPrints;
                        let tbodyHTML = ``;
                        fPrints.forEach(fprint => {
                            tbodyHTML += `
                                <tr>
                                    <td>${fprint.first_name} ${fprint.last_name} ${fprint.father_name}</td>
                                    <td>${fprint.projName}</td>
                                    <td>${fprint.deptName}</td>
                                    <td>${fprint.posName}</td>
                                    <td>${fprint.f_print_time}</td>
                                    <td>${fprint.f_print_date}</td>
                                </tr>
                            `;
                        });
                        tbody.innerHTML = tbodyHTML;
                        loading.classList.add("d-none");
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }, 1000);
        });
    });
}

const renderPage = (render_offset = null) => {
    getInputDatas();
    let offset;
    if (render_offset) {
        offset = render_offset
    } else {
        offset = 0;
    }
    const data = {
        qEmployee,
        qProject,
        qDepartment,
        qPosition,
        qMin,
        qMax,
        qDate,
        offset
    }
    $.ajax({
        type: "POST",
        url: "/api/fprints/fprints",
        data,
        success: ((res) => {
            const count = Math.ceil(res.count / 15);
            const fPrints = res.fPrints;
            console.log(data);
            console.log(fPrints);
            let tbodyHTML = ``;
            fPrints.forEach(fprint => {
                tbodyHTML += `
                    <tr>
                        <td>${fprint.first_name} ${fprint.last_name} ${fprint.father_name}</td>
                        <td>${fprint.projName}</td>
                        <td>${fprint.deptName}</td>
                        <td>${fprint.posName}</td>
                        <td>${fprint.f_print_time}</td>
                        <td>${fprint.f_print_date}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = tbodyHTML;
            let pgHtml = '';
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
            loading.classList.add("d-none");
            pageFuncs();
        })
    }).catch((err) => {
        console.log(err);
    });
}

employeeInput.addEventListener("keyup", () => {
    renderPage();
});

projectInput.addEventListener("keyup", () => {
    renderPage();
});

deptInput.addEventListener("keyup", () => {
    renderPage();
});

positionInput.addEventListener("keyup", () => {
    renderPage();
});

minInput.addEventListener("change" , () => {
    renderPage();
});
maxInput.addEventListener("change", () => {
    renderPage();
});
dateInput.addEventListener("change", () => {
    renderPage();
});

console.log(dateInput.value);

setTimeout(renderPage, 1000);