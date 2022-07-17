const fPrintType = document.querySelector("#fPrintType");
const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pgContainer = document.querySelector(".pagination-container");
const thead = document.querySelector(".headers");
const inputs = document.querySelector(".inputs");

const renderAllFPrint = () => {
    const qEmp = $("#qEmployee");
    const qProj = $("#qProject");
    const qDept = $("#qDepartment");
    const qPos = $("#qPosition");
    const qTime = $("#qTime");
    const qDay = $("#day");
    const qMonth = $("#month");
    const qYear = $("#year");


    const pgContatiner = document.querySelector(".pagination-container");
    const loading = document.querySelector(".loading");

    const pageFunctions = () => {
        let pgItems = document.querySelectorAll('.pagination-item');
        let fTDots = document.querySelector('.fTDots');
        let lTDots = document.querySelector('.lTDots');
        pgItems = Array.from(pgItems);
        pgItems.forEach(item => {
            item.addEventListener("click", () => {
                loading.classList.remove('d-none');
                let offset = parseInt(item.value) - 1;
                let activeClass = document.querySelector('.active');
                let index = pgItems.indexOf(activeClass);
                pgItems[index].classList.remove('active');
                item.classList.add('active');
                activeClass = document.querySelector('.active');
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

                    $.post('http://localhost:3000/all-fprints/api', {
                        qEmployee: qEmp,
                        qProject: qProj,
                        qDepartment: qDept,
                        qPosition: qPos,
                        qTime: qTime,
                        qDay: qDay,
                        qMonth: qMonth,
                        qYear: qYear,
                        offset: offset
                    }, (res) => {
                        let tbody = $("tbody");
                        let trs = "";
                        tbody.text("");
                        let fprints = res.result.fprints;
                        for (let i = 0; i < fprints.length; i++) {
                            const date = new Date(fprints[i].date);
                            let time = [];
                            if(fprints[i].date) {
                                time = fprints[i].time.split(':');
                                time = time[0] + ":" + time[1];
                            }
                            let createdAt = date.toLocaleDateString();
                            createdAt = createdAt.split('/');
                            let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                            trs +=
                                `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                        }
                        if(trs.length !== 0) {
                            tbody.html(trs);
                        } else {
                            tbody.text("No Data Found");
                        }
                        loading.classList.add('d-none');
                    });
                }, 1000);
            });
        });
    }

    const renderPage = () => {
        let qEmp = $("#qEmployee").val();
        let qProj = $("#qProject").val();
        let qDept = $("#qDepartment").val();
        let qPos = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();
        let offset = 0;

        $.post("http://localhost:3000/all-fprints/api", {
                qEmployee: qEmp,
                qProject: qProj,
                qDepartment: qDept,
                qPosition: qPos,
                qTime: qTime,
                qDay: qDay,
                qMonth: qMonth,
                qYear: qYear,
                offset: offset
            },
            (res) => {
                let fprints = res.result.fprints;
                let count = res.result.count;
                let html = '';
                count = Math.ceil(count / 15);

                for (let i = 1; i <= count; i++) {
                    if (i === 1) {
                        html += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                        html += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                    } if (i > 21 && i < count) {
                        html += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    } else if (i !== 1 && i !== count) {
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                    if (i === count) {
                        if(count > 21) {
                            html += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                        }
                        if (i > 1) {
                            html += `
                                <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                            `
                        }
                    }
                }
                pgContatiner.innerHTML = html;
                let tbody = $("tbody");
                let trs = "";
                tbody.text("");
                for (let i = 0; i < fprints.length; i++) {
                    const date = new Date(fprints[i].date);
                    let time = fprints[i].time.split(':');
                    time = time[0] + ":" + time[1];
                    let createdAt = date.toLocaleDateString();
                    createdAt = createdAt.split('/');
                    let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                    trs +=
                        `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                }
                if(trs.length !== 0) {
                    tbody.html(trs);
                } else {
                    tbody.text("No Data Found");
                }
                loading.classList.add('d-none');
                pageFunctions();
            });
    } 
    
    const exportToExcel = () => {
        let qEmployee = $("#qEmployee").val();
        let qProject = $("#qProject").val();
        let qDepartment = $("#qDepartment").val();
        let qPosition = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();

        const method = "post";
        let params = {
            qEmployee,
            qProject,
            qDepartment,
            qPosition,
            qTime,
            qDay,
            qMonth,
            qYear,
            limit: "all"
        }
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/all-fprints/api/excel-report");
     
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
     const exportAllFPrint = document.querySelector("#exportAllFPrint");

     exportAllFPrint.addEventListener("click", () => {
        exportToExcel()
    });
    setTimeout(renderPage, 2500);

    qEmp.keyup(renderPage)
    qProj.keyup(renderPage)
    qDept.keyup(renderPage)
    qPos.keyup(renderPage)
    qTime.keyup(renderPage)
    qDay.change(renderPage)
    qMonth.change(renderPage)
    qYear.change(renderPage)


}
renderAllFPrint();