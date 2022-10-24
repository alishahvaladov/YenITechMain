const loading = document.querySelector(".loading");
const qEmloyeeInput = document.querySelector("#qEmployee");
const qProjectInput = document.querySelector("#qProject");
const qDepartmentInput = document.querySelector("#qDepartment");
const qPositionInput = document.querySelector("#qPosition");
const qTimeEnterInput = document.querySelector("#qTimeEnter");
const qTimeLeaveInput = document.querySelector("#qTimeLeave");
const qDateInput = document.querySelector("#qDate");
const tbody = document.querySelector("tbody");

const timeEnterReset = document.querySelector("#qTimeEnterReset");
const timeLeaveReset = document.querySelector("#qTimeLeaveReset");
const dateReset = document.querySelector("#qDateReset");

const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");

let qEmployee, qProject, qDepartment, qPosition, qTimeEnter, qTimeLeave, qDate;

const getInputData = () => {
    qEmployee = qEmloyeeInput.value;
    qProject = qProjectInput.value;
    qDepartment = qDepartmentInput.value;
    qPosition = qPositionInput.vlaue;
    qTimeEnter = qTimeEnterInput.value;
    qTimeLeave = qTimeLeaveInput.value;
    qDate = qDateInput.value;
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
                getInputData();
                $.ajax({
                    type: "POST",
                    url: "/api/nofprints",
                    data: {
                        qEmployee,
                        qProject,
                        qDepartment,
                        qPosition,
                        qTimeEnter,
                        qTimeLeave,
                        qDate
                    },
                    success: ((res) => {
                        const fprints = res.fprints;
            
                        let tbodyHTML = "";
            
                        fprints.forEach(fprint => {
                            let leaveTD;
                            if (fprint.leave_sign_time === null) {
                                leaveTD = `<button class="btn btn-outline-warning" id="${fprint.id}"><i class="bi bi-plus-square"></i></button>`
                            } else {
                                leaveTD = fprint.leave_sign_time;
                            }
                            tbodyHTML += `
                                <tr>
                                    <td>${fprint.name} ${fprint.surname} ${fprint.fname}</td>
                                    <td>${fprint.projName}</td>
                                    <td>${fprint.deptName}</td>
                                    <td>${fprint.posName}</td>
                                    <td>${fprint.enter_sign_time}</td>
                                    <td class="text-center">${leaveTD}</td>
                                    <td>${fprint.date}</td>
                                    <td></td>
                                </tr>
                            `;
                        });
            
                        tbody.innerHTML = tbodyHTML;
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }, 1000);
        });
    });
}

const renderPage = () => {
    getInputData();
    $.ajax({
        type: "POST",
        url: "/api/nofprints",
        data: {
            qEmployee,
            qProject,
            qDepartment,
            qPosition,
            qTimeEnter,
            qTimeLeave,
            qDate
        },
        success: ((res) => {
            const count = parseInt(res.count) / 15;
            const fprints = res.fprints;

            let tbodyHTML = "";

            fprints.forEach(fprint => {
                let leaveTD;
                if (fprint.leave_sign_time === null) {
                    leaveTD = `<button class="btn btn-outline-warning" id="${fprint.id}"><i class="bi bi-plus-square"></i></button>`
                } else {
                    leaveTD = fprint.leave_sign_time;
                }
                tbodyHTML += `
                    <tr>
                        <td>${fprint.name} ${fprint.surname} ${fprint.fname}</td>
                        <td>${fprint.projName}</td>
                        <td>${fprint.deptName}</td>
                        <td>${fprint.posName}</td>
                        <td>${fprint.enter_sign_time}</td>
                        <td class="text-center">${leaveTD}</td>
                        <td>${fprint.date}</td>
                        <td></td>
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
                    `;
                   }
                }
             }
            pagination.classList.remove('d-none');
            pgContainer.innerHTML = pgHtml;
        })
    }).catch((err) => {
        console.log(err);
    })
    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);

timeEnterReset.addEventListener("click", () => {
    qTimeEnterInput.value = "";
    renderPage();
});

timeLeaveReset.addEventListener("click", () => {
    qTimeLeaveInput.value = "";
    renderPage();
});

dateReset.addEventListener("click", () => {
    qDateInput.value = "";
    renderPage();
});

qEmloyeeInput.addEventListener("keyup", () => {
    renderPage();
});

qProjectInput.addEventListener("keyup", () => {
    renderPage();
});

qDepartmentInput.addEventListener("keyup", () => {
    renderPage();
});

qPositionInput.addEventListener("keyup", () => {
    renderPage();
});

qTimeEnterInput.addEventListener("change", () => {
    renderPage();
});

qTimeLeaveInput.addEventListener("change", () => {
    renderPage();
});

qDateInput.addEventListener("change", () => {
    renderPage();
});