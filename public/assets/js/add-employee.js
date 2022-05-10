const projSelector = $("#project_id");
const deptSelector = $("#department_id");
const posSelector = $("#position_id");
const shiftTypeSelect = document.querySelector("#select_shift_type");
const shiftAuto = document.querySelector(".shift-auto");
const shiftManual = document.querySelector(".shift-manual");
const loading = document.querySelector('.loading');

const renderPage = () => {
    projSelector.change(() => {
        let id = projSelector.val();
        $.get(`http://localhost:3000/api/department/by-project/${id}`, (res) => {
            const result = res.result;
            deptSelector.text(" ");
            deptSelector.append(`<option value="" hidden>Seçin</option>`)
            for (let i = 0; i < result.length; i++) {
                deptSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
            posSelector.html(" ");
            console.log(result);
        });
    });
    
    deptSelector.change(() => {
        let deptID = deptSelector.val();
        $.get(`http://localhost:3000/api/position/by-department/${deptID}`, (res) => {
            const result = res.result;
            posSelector.text(" ");
            posSelector.append(`<option value="" hidden>Seçin</option>`)
            for (let i = 0; i < result.length; i++) {
                posSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
            console.log(result);
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

    loading.classList.add('d-none');
}

setTimeout(renderPage, 1000);