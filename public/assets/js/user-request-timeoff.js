const empDataInput = document.querySelector("#toff-emp");
const projectInput = document.querySelector("#toff-branch");
const departmentInput = document.querySelector("#toff-department");
const positionInput = document.querySelector("#toff-emp-position");

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


const timeOffNonHourDiv = document.querySelector('.toff-non-hour-types');
const timeOffHourDiv = document.querySelector('.toff-hour-type');

const loading = document.querySelector(".loading");

const renderPage = () => {
    const getUserData = () => {
        $.get('http://localhost:3000/api/profile/user-data', (res) => {
            const employee = res.employee[0];
            empDataInput.value = `${employee.first_name} ${employee.last_name} ${employee.father_name}`;
            projectInput.value = employee.projName;
            departmentInput.value = employee.deptName;
            positionInput.value = employee.posName;
            loading.classList.add("d-none");
        });
    }
    
    flatpickr("#w-start-date", {
        dateFormat: "Y-m-d",
        enable: ['']
    });
    
    getUserData();
    
    timeOffEndDate.addEventListener("change", () => {
        let timeOffEndDateValue = new Date(timeOffEndDate.value);
        let dayAfterEndDateValue = new Date(timeOffEndDate.value);
        dayAfterEndDateValue.setDate(dayAfterEndDateValue.getDate() + 1);
        console.log(timeOffEndDateValue.toLocaleDateString());
        console.log(dayAfterEndDateValue.toLocaleDateString());
        flatpickr("#w-start-date", {
            dateFormat: "Y-m-d",
            enable:
            [
                `${timeOffEndDateValue.getFullYear()}-${timeOffEndDateValue.getMonth() + 1}-${timeOffEndDateValue.getDate()}`,
                `${dayAfterEndDateValue.getFullYear()}-${dayAfterEndDateValue.getMonth() + 1}-${dayAfterEndDateValue.getDate()}`
            ]
        });
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
            let nameSurnameFather = empDataInput.value;
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
                sedrName: "Mahir Mammadzada",
                directorName: "Mehdi Mammadzada",
            }
    
            $.ajax({
                method: "post",
                url: "http://localhost:5000/day-off/form/validate",
                data: params,
                dataType: 'json',
                success: function(json, status) {
                    if (json.success === true) {
                        params.time = json.time;
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
    
    timeOffType.addEventListener("change", () => {
        if (parseInt(timeOffType.value) === 4) {
            timeOffHourDiv.classList.remove('d-none');
            timeOffNonHourDiv.classList.add('d-none');
        } else {
            timeOffHourDiv.classList.add('d-none');
            timeOffNonHourDiv.classList.remove('d-none');
        }
    })
    
    applyBtn.addEventListener('click', () => {
        $.post('http://localhost:3000/api/profile/request-time-off', {
            timeOffType: timeOffType.value,
            toffTime: toffTime.value,
            timeOffStartDate: timeOffStartDate.value,
            timeOffEndDate: timeOffEndDate.value,
            wStartDate: wStartDate.value,
            toffTimeDate: toffTimeDate.value
        }, (res) => {
            console.log(res.success === true);
            if (res.success === true) {
                window.location = '/profile';
            }
        });
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
    });
}

setTimeout(renderPage, 1000);