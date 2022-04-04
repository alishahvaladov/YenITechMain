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
            const deptDirector = `${res.result.deptDirector[0].first_name} ${res.result.deptDirector[0].last_name}`;
            const director = `${res.result.director[0].first_name} ${res.result.director[0].last_name}`;
            deptDirectorInp.val(deptDirector);
            directorInp.val(director);
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
        })
    }
    
} 



applyBtn.addEventListener("click", () => {
    sendTimeOffRequest();
});

nextBtn.addEventListener("click", () => {
    timeOffSelectContainer.classList.add("d-none");
    timeOffSelectContainer.classList.remove("d-flex");
    wordBtnContainer.classList.add("d-flex");
    wordBtnContainer.classList.remove("d-none");
    nextBtn.classList.add("d-none");
    applyBtn.classList.remove("d-none");
    const downloadDoc = document.querySelector("#downloadDoc");
    downloadDoc.addEventListener("click", () => {
        uploadDoc.disabled = false;
        const dateForID = new Date();
        let project = document.querySelector("#toff-branch");
        project = project.value;
        let dayOffType = document.querySelector("#time-off-selector");
        let dayOffOptions = dayOffType.options;
        dayOffType = dayOffOptions[timeOffType.value].text;
        let dayOffS = document.querySelector("#toff-start-date");
        dayOffS = dayOffS.value
        const dayStart = new Date(dayOffS);
        dayOffS = dayOffS.split("-");
        dayOffS = `${dayOffS[2]}.${dayOffS[1]}.${dayOffS[0]}`
        let dayOffE = document.querySelector("#toff-end-date");
        dayOffE = dayOffE.value;
        const dayEnd = new Date(dayOffE);
        dayOffE = dayOffE.split("-");
        dayOffE = `${dayOffE[2]}.${dayOffE[1]}.${dayOffE[0]}`
        let wStartDate = document.querySelector("#w-start-date");
        wStartDate = wStartDate.value;
        let nameSurnameFather = document.querySelector("#toff-maker");
        let empOptions = nameSurnameFather.options;
        for(let i = 0; i < empOptions.length; i++) {
            if (empOptions[i].value === nameSurnameFather.value) {
                nameSurnameFather = empOptions[i].text;
            }
        }                    
        let department = document.querySelector("#toff-department");
        department = department.value;
        department = department.replace("şöbə", "")
        console.log(department);
        let position = document.querySelector("#toff-emp-position");
        position = position.value;
        let time = dateForID.getTime();
        let sedrName = document.querySelector("#deptDirector");
        sedrName = sedrName.value;
        let directorName = document.querySelector("#director");
        directorName = directorName.value;
        let dayOffD = dayEnd.getTime() - dayStart.getTime();
        dayOffD = dayOffD / (1000 * 3600 * 24);
        const dayOffDWithWords = new NumberAzeriTranslator(dayOffD);
        dayOffD = `${dayOffD}(${dayOffDWithWords.translate()})`;
        

        const params = {
            project,
            dayOffType,
            dayOffS,
            dayOffE,
            wStartDate,
            nameSurnameFather,
            department,
            position,
            time,
            dayOffD,
            sedrName,
            directorName
        }
        $.ajax({
            method: "post",
            url: "http://localhost:5000/day-off/form/validate",
            data: params,
            dataType: 'json',
            success: function(json, status) {
                if (json.success === true) {
                    const method = "post";
                    let form = document.createElement('form');
                    form.setAttribute("method", method);
                    form.setAttribute("action", "http://localhost:5000/day-off/form/download");
                    
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
                } else if (json.success === false ) {
                    alert(json.message);
                }
            },
            error: function(result, status, err) {
                console.log(result);
                console.log(status);
                console.log(err);
            }
        });
    }); 
});


timeOffType.addEventListener('change', () => {
    console.log(timeOffType.value);
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
});