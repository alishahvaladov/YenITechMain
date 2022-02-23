const empSelector = $("#toff-maker");
const messageDIV = document.querySelector('.messages');

empSelector.change(function () {
    let id = empSelector.val();
    let department = $("#toff-department");
    let project = $("#toff-branch");
    let position = $("#toff-emp-position");

    $.post("http://localhost:3000/api/time-off/emp-info", {
        id: id
    }, (res) => {
        console.log(res.result[0]);
        department.val(res.result[0].depName);
        project.val(res.result[0].projName);
        position.val(res.result[0].posName);
    })
});

const timeOffType = document.querySelector("#time-off-selector");
const timeOffStartDate = document.querySelector("#toff-start-date");
const timeOffEndDate = document.querySelector("#toff-end-date");
const wStartDate = document.querySelector("#w-start-date");
const emp = document.querySelector("#toff-maker");
const applyBtn = document.querySelector("#toffNextBtn");

timeOffEndDate.addEventListener("change", () => {
    let timeOffEndDateValue = timeOffEndDate.value.split("-");
    timeOffEndDateValue[2] = parseInt(timeOffEndDateValue[2]) + 1;
    timeOffEndDateValue = timeOffEndDateValue.join("-");
    let html = `
            <option value="${timeOffEndDate.value}">${timeOffEndDate.value}</option>
            <option value="${timeOffEndDateValue}">${timeOffEndDateValue}</option>
        `;
    wStartDate.innerHTML = html;
});

const sendTimeOffRequest = () => {
    $.post("http://localhost:3000/api/time-off/add", {
        timeOffType: timeOffType.value,
        timeOffStartDate: timeOffStartDate.value,
        timeOffEndDate: timeOffEndDate.value,
        wStartDate: wStartDate.value,
        emp: emp.value,
    }).done((data) => {
        let html = `
            <div class="alert alert-success alert-dismissible fade show">
               Məzuniyyət sorğusu əlavə olundu
            </div>
        `
        messageDIV.innerHTML = html;
        setTimeout(() => {
            messageDIV.innerHTML = "";
        }, 2000);
    }).fail((err) => {
        const message = err.responseJSON.message;
        let html = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
            </div>
        `
        messageDIV.innerHTML = html;
        setTimeout(() => {
            messageDIV.innerHTML = "";
        }, 2000);
    });
}

applyBtn.addEventListener("click", () => {
    sendTimeOffRequest();
});