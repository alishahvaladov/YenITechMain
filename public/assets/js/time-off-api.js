const empSelector = $("#toff-maker");
const messageDIV = document.querySelector('.messages');
const toffBranch = $("#toff-branch");
const empNameForWord = $("#empNameForWord");
const deptDirectorInp = $("#deptDirector");
const directorInp = $("#director");
const uploadDoc = document.querySelector("#uploadDoc");
const toffStartDiv = document.querySelector('.toff-start-date');
const toffEndDiv = document.querySelector('.toff-end-date');
const toffTimeDiv = document.querySelector(".toff-authorized-time");
const toffTimeDateDiv = document.querySelector('.timeoff-time-date');
const wStartDateDiv = document.querySelector('.w-start-date');
const loading = document.querySelector(".loading");
const approveModal = document.querySelector(".approve-modal");
const healthToffPercent = document.querySelector(".health-toff-percentage");

empSelector.change(function () {
    let id = empSelector.val();
    let department = $("#toff-department");
    let project = $("#toff-branch");
    let position = $("#toff-emp-position");

    $.post("http://localhost:3000/api/time-off/emp-info", {
        id: id
    }, (res) => {
        department.val(res.result[0].depName);
        project.val(res.result[0].projName);
        position.val(res.result[0].posName);
        $.post("http://localhost:3000/api/time-off/get-directors", {
            projID: res.result[0].project_id,
            deptID: res.result[0].department
        }, (res) => {
            // console.log(res);
            // const deptDirector = `${res.result.deptDirector[0].first_name} ${res.result.deptDirector[0].last_name}`;
            // const director = `${res.result.director[0].first_name} ${res.result.director[0].last_name}`;
            // deptDirectorInp.val(deptDirector);
            // directorInp.val(director);
        });
    });
});

const timeOffType = document.querySelector("#time-off-selector");
const timeOffStartDate = document.querySelector("#toff-start-date");
const timeOffEndDate = document.querySelector("#toff-end-date");
const wStartDate = document.querySelector("#w-start-date");
const emp = document.querySelector("#toff-maker");
const applyBtn = document.querySelector("#toffApplyBtn");
const nextBtn = document.querySelector("#toffNextBtn");
const timeOffSelectContainer = document.querySelector(".time-off-select-container");
const wordBtnContainer = document.querySelector(".word-btn-container");
const toffTime = document.querySelector("#toff-authorized-time");
const toffTimeDate = document.querySelector('#timeoff-time-date');
const cancelMoodalBtn = document.querySelector("#cancelBtn")


flatpickr("#w-start-date", {
    dateFormat: "Y-m-d",
    enable: ['']
 });

timeOffEndDate.addEventListener("change", () => {
    let timeOffEndDateValue = new Date(timeOffEndDate.value);
    let dayAfterEndDateValue = new Date();
    dayAfterEndDateValue.setDate(timeOffEndDateValue.getDate() + 1);
    flatpickr("#w-start-date", {
        dateFormat: "Y-m-d",
        enable: [`${timeOffEndDateValue.getFullYear()}-${timeOffEndDateValue.getMonth() + 1}-${timeOffEndDateValue.getDate()}`, `${dayAfterEndDateValue.getFullYear()}-${dayAfterEndDateValue.getMonth() + 1}-${dayAfterEndDateValue.getDate()}`]
     }); 
});

const sendTimeOffRequest = () => {
    let fd = new FormData();
    let file = uploadDoc.files[0];
    const id = emp.value;
    if (file) {
        fd.append('file', file);
        $.ajax({
            url: `http://localhost:3000/api/time-off/upload-form/${id}`,
            type: "post", 
            data: fd,
            enctype: "multipart/form-data",
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                $.post("http://localhost:3000/api/time-off/add", {
                    timeOffType: timeOffType.value,
                    timeOffStartDate: timeOffStartDate.value,
                    timeOffEndDate: timeOffEndDate.value,
                    wStartDate: wStartDate.value,
                    toffTime: toffTime.value,
                    toffTimeDate: toffTimeDate.value,
                    emp: emp.value
                }).done((data) => {
                    let html = `
                        <div class="alert alert-success alert-dismissible fade show">
                            Məzuniyyət sorğusu əlavə olundu
                        </div>
                    `
                    $("body").css("cursor", "progress")
                    messageDIV.innerHTML = html;
                    setTimeout(() => {
                        messageDIV.innerHTML = "";
                        location.href = "/timeoffrequests"
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
        }).catch((err) => {
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
        })
    }
    
} 



applyBtn.addEventListener("click", () => {
    sendTimeOffRequest();
});



timeOffType.addEventListener('change', () => {
    if (parseInt(timeOffType.value) === 4) {
        toffStartDiv.classList.add('d-none');
        toffEndDiv.classList.add('d-none');
        wStartDateDiv.classList.add('d-none');
        toffTimeDiv.classList.remove('d-none');
        toffTimeDateDiv.classList.remove('d-none');
    } else {
        toffStartDiv.classList.remove('d-none');
        toffEndDiv.classList.remove('d-none');
        wStartDateDiv.classList.remove('d-none');
        toffTimeDiv.classList.add('d-none');
        toffTimeDateDiv.classList.add('d-none');
    }

    if (parseInt(timeOffType.value) === 3) {
        healthToffPercent.classList.remove("d-none");
    } else {
        healthToffPercent.classList.add("d-none");
    }

});

nextBtn.addEventListener("click", () => {
    approveModal.classList.remove("d-none");
    approveModal.classList.add("d-flex");
});

cancelMoodalBtn.addEventListener("click", () => {
    approveModal.classList.remove("d-flex");
    approveModal.classList.add("d-none");
});

setTimeout(() => {
    loading.classList.add("d-none");
}, 1000);