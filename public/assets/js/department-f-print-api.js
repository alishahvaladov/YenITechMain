const loading = document.querySelector(".loading");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");
const tbody = document.querySelector("tbody");

const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    console.log(pgItems);
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
                let qEmp = $("#qEmployee").val();
                let qProj = $("#qProject").val();
                let qDept = $("#qDepartment").val();
                let qPos = $("#qPosition").val();
                let qTime = $("#qTime").val();
                let qDay = $("#day").val();
                let qMonth = $("#month").val();
                let qYear = $("#year").val();

                $.ajax({
                    type: "POST",
                    url: "/api/fprints/department",
                    data: {
                        qEmployee: qEmp,
                        qProject: qProj,
                        qDepartment: qDept,
                        qPosition: qPos,
                        qTime: qTime,
                        qDay: qDay,
                        qMonth: qMonth,
                        qYear: qYear,
                        offset: parseInt(offset),
                        limit: 15
                    },
                    success: ((res) => {
                        const fprints = res.fprints;
                        let tbodyHTML = "";
                        fprints.forEach(fprint => {
                            tbodyHTML += `
                                <tr>
                                    <td>${fprint.first_name} ${fprint.last_name} ${fprint.father_name}</td>
                                    <td>${fprint.projName}</td>
                                    <td>${fprint.deptName}</td>
                                    <td>${fprint.posName}</td>
                                    <td>${fprint.f_print_time}</td>
                                    <td>${fprint.f_print_date}</td>
                                </tr>
                            `
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
const renderPage = () => {
    const data = {};
    $.ajax({
        type: "POST",
        url: "/api/fprints/department",
        data: {
            limit: 15,
            offset: 0
        },
        success: ((res) => {
            let count = res.count[0].count;
            let tbodyHTML = "";
            count = Math.ceil(count / 15);

            const fprints = res.fprints;

            fprints.forEach(fprint => {
                tbodyHTML += `
                    <tr>
                        <td>${fprint.first_name} ${fprint.last_name} ${fprint.father_name}</td>
                        <td>${fprint.projName}</td>
                        <td>${fprint.deptName}</td>
                        <td>${fprint.posName}</td>
                        <td>${fprint.f_print_time}</td>
                        <td>${fprint.f_print_date}</td>
                    </tr>
                `
            });

            tbody.innerHTML = tbodyHTML;

            let pgHtml = "";
            if (count === 1) {
                pagination.classList.add('d-none');
             } else {
                for (let i = 1; i <= count; i++) {
                   if (i === 1) {
                      pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                      if(count > 21) {
                         pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                      } else {
                        pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots d-none disabled">...</button>`
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
                      } else {
                        pgHtml += `
                            <button class="btn btn-outline-dark btn-sm lTDots d-none disabled">...</button>
                        `
                      }
                      if (count > 1) {
                         pgHtml += `
                           <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                      }
                   }
                }
                pgContainer.innerHTML = pgHtml;
             }
             pageFunctions();
        })
    }).catch((err) => {
        console.log(err);
    });

    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);