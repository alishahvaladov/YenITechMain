const projSelector = $("#project_id");
const deptSelector = $("#department_id");
const posSelector = $("#position_id");
const shiftTypeSelect = document.querySelector("#select_shift_type");
const shiftAuto = document.querySelector(".shift-auto");
const shiftManual = document.querySelector(".shift-manual");

if(projSelector) {
    projSelector.change(() => {
        let id = projSelector.val();
        $.post("http://localhost:3000/api/department", {
            id: id
        }, (res) => {
            const result = res.result;
            deptSelector.text(" ");
            for (let i = 0; i < result.length; i++) {
                deptSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
            console.log(result);
        })
    });
}
if(deptSelector) {
    deptSelector.change(() => {
        let projID = projSelector.val();
        let deptID = deptSelector.val();
        $.post("http://localhost:3000/api/position", {
            projID: projID,
            deptID: deptID
        }, (res) => {
            const result = res.result;
            posSelector.text(" ");
            for (let i = 0; i < result.length; i++) {
                posSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
            }
            console.log(result);
        });
    });
}
const fullDay = document.querySelector("#full_day");
const workingDayInput = document.querySelector("#working_days");
if(fullDay) {
    fullDay.addEventListener("click", () => {
        if(fullDay.checked) {
            workingDayInput.disabled = true;
            workingDayInput.setAttribute("style", "box-shadow: -1px -1px 3px rgb(255 255 255), 2px 2px 6px rgb(0 0 0 / 30%), inset -2px -2px 10px rgb(255 255 255), inset 2px 2px 10px rgb(0 0 0 / 30%); !important");
        } else {
            workingDayInput.disabled = false;
            workingDayInput.setAttribute("style", "-1px -1px 3px rgb(255 255 255 / 10%), 2px 2px 6px rgb(0 0 0 / 30%); !important");

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
