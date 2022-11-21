const projSelector = $("#project_id");
const deptSelector = $("#department_id");
const groupSelector = $("#group_id");
const posSelector = $("#position_id");
const shiftTypeSelect = document.querySelector("#select_shift_type");
const shiftAuto = document.querySelector(".shift-auto");
const shiftManual = document.querySelector(".shift-manual");
const loading = document.querySelector('.loading');
const phoneNumbInput = document.querySelector("#phone_number");
const submitBtn = document.querySelector("#submitBtn");

const renderPage = () => {
    projSelector.change(() => {
        let id = projSelector.val();
        $.get(`/api/department/by-project/${id}`, (res) => {
            const result = res.result;
            deptSelector.text(" ");
            deptSelector.append(`<option value="" hidden>Seçin</option>`)
            for (let i = 0; i < result.length; i++) {
                deptSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
            posSelector.html(" ");
        });
    });
    
    deptSelector.change(() => {
        let deptID = deptSelector.val();
        $.get(`/api/groups/all/${deptID}`, (res) => {
            const result = res.result;
            groupSelector.text(" ");
            groupSelector.append(`<option value="" hidden>Seçin</option>`)
            for (let i = 0; i < result.length; i++) {
                groupSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
        });
    });

    groupSelector.change(() => {
        const groupID = groupSelector.val();
        $.get(`/api/position/by-group/${groupID}`, (res) => {
            const result = res.result;
            posSelector.text(" ");
            posSelector.append(`<option value="" hidden>Seçin</option>`)
            for (let i = 0; i < result.length; i++) {
                posSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
        });
    });
    
    const fullDay = document.querySelector("#full_day");
    const workingDayInput = document.querySelector("#working_days");
    
    if(fullDay) {
        fullDay.addEventListener("click", () => {
            if(fullDay.checked) {
                workingDayInput.disabled = true;
                workingDayInput.placeholder = "Tam iş günü";
            } else {
                workingDayInput.disabled = false;
                workingDayInput.placeholder = ""
            }
        });
    }
    
    const recInputs = document.querySelectorAll(".recruitment-scans");
    
    if(recInputs) {
        recInputs.forEach(item => {
            item.addEventListener("change", () => {
                const parent = item.parentNode;
                let child = parent.childNodes[3];
                child.childNodes[3].classList.remove("d-none");
            });
        });
    }
    
    shiftTypeSelect.addEventListener("change", () => {
        const value = shiftTypeSelect.value;
        if (parseInt(value) === 1) {
            shiftAuto.classList.remove('d-none');
            shiftManual.classList.add('d-none');
        } else if (parseInt(value) === 2) {
            shiftManual.classList.remove('d-none');
            shiftAuto.classList.add('d-none');
        }
    });

    const phoneNumbInputHandler = () => {
        phoneNumbInput.addEventListener("keyup", () => {
            let phoneNumb = phoneNumbInput.value.toString();
            phoneNumb = phoneNumb.replaceAll("(", "");
            phoneNumb = phoneNumb.replaceAll(")", "");
            phoneNumb = phoneNumb.replaceAll(" ", "");

            if (phoneNumb.length > 0 && phoneNumb.length <= 2) {
                phoneNumbInput.value = `(${phoneNumb.slice(0, 2)})`;
            }
            if (phoneNumb.length > 2 && phoneNumb.length <= 5) {
                phoneNumbInput.value = `(${phoneNumb.slice(0, 2)}) ${phoneNumb.slice(2, 5)}`;
            }

            if (phoneNumb.length > 5 && phoneNumb.length <= 7) {
                phoneNumbInput.value = `(${phoneNumb.slice(0, 2)}) ${phoneNumb.slice(2, 5)} ${phoneNumb.slice(5, 7)}`;
            }

            if (phoneNumb.length > 7 && phoneNumb.length <= 9) {
                phoneNumbInput.value = `(${phoneNumb.slice(0, 2)}) ${phoneNumb.slice(2, 5)} ${phoneNumb.slice(5, 7)} ${phoneNumb.slice(7, 9)}`;
            }
        });
    }

    phoneNumbInputHandler()

    loading.classList.add('d-none');
}

submitBtn.addEventListener("click", () => {
    const employeeInputs = document.querySelectorAll(".emp-data-input");
    const data = {};
    employeeInputs.forEach(item => {
        data[item.name] = item.value;
    });
    loading.classList.remove("d-none");
    $.ajax({
        type: "POST",
        url: "/api/employee/add",
        data,
        success: (res) => {
            const emp_id = res.emp_id;
            window.location.href = `/employee/emp-files/${emp_id}`;
        }
    }).catch((err) => {
        if (err.responseJSON.message) {
            const message = err.responseJSON.message;
            for (const [key, value] of Object.entries(message)) {
                const errorInput = document.getElementsByName(key);
                errorInput.forEach(item => {
                    const inputID = item.id;
                    const labelForInput = document.querySelector(`label[for='${inputID}']`)
                    labelForInput.classList.add("error-label");
                    const labelHTML = labelForInput.innerHTML;
                    labelForInput.innerHTML = `${labelHTML} <span>${value}</span>`
                    item.classList.add("error-input");
                    item.addEventListener("click", () => {
                        labelForInput.classList.remove("error-label");
                        item.classList.remove("error-input");
                        labelForInput.innerHTML = labelHTML;
                    });
                });
            }
            setTimeout(() => {
                loading.classList.add("d-none");
            }, 500);
        }
    })
});

setTimeout(renderPage, 1000);