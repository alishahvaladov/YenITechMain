const empSelector = $("#toff-maker");
const messageDIV = document.querySelector('.messages');
const toffBranch = $("#toff-branch");
const empNameForWord = $("#empNameForWord");
const deptDirectorInp = $("#deptDirector");
const directorInp = $("#director");
const uploadDoc = document.querySelector("#uploadDoc");
const downloadDoc = document.querySelector("#downloadDoc");
const toffStartDiv = document.querySelector('.toff-start-date');
const toffEndDiv = document.querySelector('.toff-end-date');
const toffTimeStartDiv = document.querySelector(".toff-authorized-time-start");
const toffTimeEndDiv = document.querySelector(".toff-authorized-time-end");
const toffTimeStartInput = document.querySelector("#toff-authorized-time-start");
const toffTimeEndInput = document.querySelector("#toff-authorized-time-end");
const toffTimeDateDiv = document.querySelector('.timeoff-time-date');
const tofftimePercent = document.querySelector("#timeoff-percent");
const wStartDateDiv = document.querySelector('.w-start-date');
const loading = document.querySelector(".loading");
const approveModal = document.querySelector(".approve-modal");
const healthToffPercent = document.querySelector(".health-toff-percentage");

empSelector.change(function () {
    let id = empSelector.val();
    let department = $("#toff-department");
    let project = $("#toff-branch");
    let position = $("#toff-emp-position");

    $.post("/api/time-off/emp-info", {
        id: id
    }, (res) => {
        department.val(res.result[0].depName);
        project.val(res.result[0].projName);
        position.val(res.result[0].posName);
        $.post("/api/time-off/get-directors", {
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
            url: `/api/time-off/upload-form/${id}`,
            type: "post", 
            data: fd,
            enctype: "multipart/form-data",
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                $.post("/api/time-off/add", {
                    timeOffType: timeOffType.value,
                    timeOffStartDate: timeOffStartDate.value,
                    timeOffEndDate: timeOffEndDate.value,
                    wStartDate: wStartDate.value,
                    timeoff_time_start: toffTimeStartInput.value,
                    timeoff_time_end: toffTimeEndInput.value,
                    toffTimeDate: toffTimeDate.value,
                    timeoff_percent: tofftimePercent.value,
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


downloadDoc.addEventListener("click", () => {
    // $.ajax({
    //     url: "http://loclahost:5005/day-off/form/validate",
    //     method: "post",
    //     data: {
    //         project: "project",
    //         department: "department",
    //         directorName: "directorName",
    //         nameSurnameFather: "nameSurnameFather",
    //         position: "position",
    //         dayOffD: "dayOffD",
    //         dayOffS: "dayOffS",
    //         dayOffE: "dayOffE",
    //         dayOffType: "dayOffType",
    //         sedrName: "sedrName",
    //         time: "time"
    //     },
    //     dataType: "json",
    //     contentType: "application/json",
    //     success: ((res) => {
    //         console.log(res);
    //     })
    // }).catch((err) => {
    //     console.log(err);
    // })
    $.post("http://localhost:5005/day-off/form/validate", {
        project: "project",
        department: "department",
        directorName: "directorName",
        nameSurnameFather: "nameSurnameFather",
        position: "position",
        dayOffD: "dayOffD",
        dayOffS: "dayOffS",
        dayOffE: "dayOffE",
        dayOffType: "dayOffType",
        sedrName: "sedrName",
        time: "time"
    }, (res) => {
        console.log(res);
        $.post("http://localhost:5005/day-off/form/download", {
            project: "Huseyn Project",
            department: "Huseyn Department",
            directorName: "Huseyn Director",
            nameSurnameFather: "Huseyn Polat Yasin",
            position: "Huseyn Position",
            dayOffD: "2",
            dayOffS: "8 noyabr 2022",
            dayOffE: "10 noyabr 2022",
            dayOffType: "Əmək Məzuniyyəti",
            sedrName: "Huseyn",
            time: "time"
        }, (res) => {
            const documentFile = res;
//            let buff = Buffer.from(documentFile, "base64");
            window.location.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${documentFile}`;
        });
    });
})

applyBtn.addEventListener("click", () => {
    sendTimeOffRequest();
});



timeOffType.addEventListener('change', () => {
    if (parseInt(timeOffType.value) === 4) {
        toffStartDiv.classList.add('d-none');
        toffEndDiv.classList.add('d-none');
        wStartDateDiv.classList.add('d-none');
        toffTimeStartDiv.classList.remove('d-none');
        toffTimeEndDiv.classList.remove('d-none');
        toffTimeDateDiv.classList.remove('d-none');
    } else {
        toffStartDiv.classList.remove('d-none');
        toffEndDiv.classList.remove('d-none');
        wStartDateDiv.classList.remove('d-none');
        toffTimeStartDiv.classList.add('d-none');
        toffTimeEndDiv.classList.add('d-none');
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