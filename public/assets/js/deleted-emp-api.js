const loading = document.querySelector(".loading");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");
const qNameInput = document.querySelector("#qName");
const qPhoneNumberInput = document.querySelector("#qPhoneNumber");
const qDepartmentInput = document.querySelector("#qDepartment");
const qPositionInput = document.querySelector("#qPosition");
const qProjectInput = document.querySelector("#qProject");

let qName, qPhoneNumber, qDepartment, qPosition, qProject;

const getInputDatas = () => {
    qName = qNameInput.value;
    qPhoneNumber = qPhoneNumberInput.value;
    qDepartment = qDepartmentInput.value;
    qPosition = qPositionInput.value;
    qProject = qProjectInput.value;
}

const pageFuncs = () => {
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
          if(pgItems.length > 21) {
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
          getInputDatas();
          setTimeout(() => {
             $.post('/api/deleted-employees', {
                offset: offset,
                qName,
                qPhoneNumber,
                qDepartment,
                qProject,
                qPosition
             }, (res) => {
                let tbody = document.querySelector('tbody');
                let result = res.result.deletedEmployees;
                let count = res.result.deletedEmployeesCount[0].count;
                let html = '';
                count = Math.ceil(count / 15);
                console.log(count);
                for (let i = 0; i < result.length; i++) {
                    let email = result[i].email;
                    let emailTD = "";
                    if (!email) {
                        emailTD = "Yoxdur"
                    } else {
                        emailTD = email;
                    }
                    html += `
                        <tr>
                        <td>${result[i].first_name + " " + result[i].last_name + " " + result[i].father_name}</td>
                        <td class="d-none d-xl-table-cell">${result[i].phone_number}</td>
                        <td>${result[i].deptName}</td>
                        <td class="d-none d-xl-table-cell">${result[i].posName}</td>
                        <td class="d-none d-xl-table-cell">${result[i].projName}</td>
                        <td class="d-flex justify-content-between last-td d-none d-xl-table-cell" style="position: relative">
                        </td>
                        </tr>
                    `;
                }
                loading.classList.add('d-none');
             });
             setTimeout(() => {
                empRemModule();
                empEditModule();
             }, 500);
          }, 1000);
       });
    });
 }

const renderPage = () => {
    getInputDatas();
    $.post(`/api/deleted-employees`, {
        qName,
        qPhoneNumber,
        qDepartment,
        qPosition,
        qProject
    }, (res) => {
        console.log(res);
        let tbody = document.querySelector('tbody');
        let result = res.result.deletedEmployees;
        let count = res.result.deletedEmployeesCount[0].count;
        let html = '';
        let pgHtml = '';
        count = Math.ceil(count / 15);
        console.log(count);
        for (let i = 0; i < result.length; i++) {
            let email = result[i].email;
            let emailTD = "";
            if (!email) {
                emailTD = "Yoxdur"
            } else {
                emailTD = email;
            }
            html += `
                <tr>
                <td>${result[i].first_name + " " + result[i].last_name + " " + result[i].father_name}</td>
                <td class="d-none d-xl-table-cell">${result[i].phone_number}</td>
                <td>${result[i].deptName}</td>
                <td class="d-none d-xl-table-cell">${result[i].posName}</td>
                <td class="d-none d-xl-table-cell">${result[i].projName}</td>
                <td class="d-flex justify-content-between last-td d-none d-xl-table-cell" style="position: relative">
                </td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
        if (count === 1) {
            pagination.classList.add('d-none');
            limit.classList.add('d-none');
        } else {
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
        pageFuncs();
        setTimeout(() => {
            loading.classList.add("d-none");
        }, 200);
    });
}


setTimeout(renderPage, 1000);