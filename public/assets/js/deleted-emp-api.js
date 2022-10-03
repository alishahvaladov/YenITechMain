const loading = document.querySelector(".loading");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");

const renderPage = () => {
    $.post(`http://localhost:3000/api/deleted-employees`, {
        
    }, (res) => {
        console.log(res);
        let tbody = document.querySelector('tbody');
        let result = res.result.deletedEmployees;
        let count = res.result.deletedEmployeesCount[0].count;
        let html = '';
        let pgHtml = '';
        let tdClass = '';
        let tdText = '';
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
            let adminBtns = `
                <div class="btn-group" role="group" aria-label="First group">
                <a type="button" class="btn btn-block btn-outline-danger" href="/employee/delete/${result[i].id}"><i class="bi bi-person-x"></i></a>
                <button type="button" class="btn btn-block btn-outline-danger empRmBtn" value="${result[i].id}"><i class="bi bi-dash-circle"></i></button>
                <button type="button" class="btn btn-block btn-outline-secondary empEditBtn" value="${result[i].id}" "><i class="bi bi-pencil-square"></i></button>
                </div>
            `
            html += `
                <tr>
                <td></td>
                <td>${result[i].first_name + " " + result[i].last_name + " " + result[i].father_name}</td>
                <td class="d-none d-xl-table-cell">${result[i].phone_number}</td>
                <td>${result[i].deptName}</td>
                <td class="d-none d-xl-table-cell">${result[i].posName}</td>
                <td class="d-none d-xl-table-cell">${result[i].projName}</td>
                <td class="d-flex justify-content-between last-td d-none d-xl-table-cell" style="position: relative">
                        ${adminBtns}
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
        setTimeout(() => {
            loading.classList.add("d-none");
        }, 200);
    });
}


setTimeout(renderPage, 1000);