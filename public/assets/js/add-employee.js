const projSelector = $("#project_id");
const deptSelector = $("#department_id");
const posSelector = $("#position_id");
const toffNextBtn = document.querySelector("#toffNextBtn");
const toffPrevBtn = document.querySelector("#toffPrevBtn");
const toffPartitions = document.querySelectorAll(".toff-partitions");
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

const fullDay = document.querySelector("#full_day");
const workingDayInput = document.querySelector("#working_days");

fullDay.addEventListener("click", () => {
   if(fullDay.checked) {
       workingDayInput.disabled = true;
       workingDayInput.setAttribute("style", "box-shadow: -1px -1px 3px rgb(255 255 255), 2px 2px 6px rgb(0 0 0 / 30%), inset -2px -2px 10px rgb(255 255 255), inset 2px 2px 10px rgb(0 0 0 / 30%); !important");
   } else {
       workingDayInput.disabled = false;
       workingDayInput.setAttribute("style", "-1px -1px 3px rgb(255 255 255 / 10%), 2px 2px 6px rgb(0 0 0 / 30%); !important");

   }
});


toffNextBtn.addEventListener("click", () => {
    for (let i = 0; i < toffPartitions.length; i++) {
        if(toffPartitions[i].classList.contains('toff-active')) {
            toffPartitions[i].classList.remove('toff-active');
            if(i + 1 >= toffPartitions.length) {
                toffPartitions[0].classList.add('toff-active');
                toffPrevBtn.disabled = true;
            } else {
                console.log(i)
                console.log(toffPartitions[i + 1]);
                toffPartitions[i+1].classList.add('toff-active');
                toffPrevBtn.disabled = false;
                if (i + 1 === toffPartitions.length - 1) {
                    toffNextBtn.disabled = true;
                } else {
                    toffNextBtn.disabled = false;
                }
            }
            break;
        }
    }
});

toffPrevBtn.addEventListener("click", (e) => {
    let tfprt = Array.from(toffPartitions);
    let activePartition = document.querySelector(".toff-active");
    let index = tfprt.indexOf(activePartition);
    for(let i = index; i >= 0; i--) {
        if(i - 1 === 0 || i - 1 < 0) {
            toffPrevBtn.disabled = true;
            toffNextBtn.disabled = false;
            tfprt[index].classList.remove('toff-active');
            tfprt[index - 1].classList.add('toff-active');
            e.preventDefault();
            console.log(i);
            break;
        } else {
            tfprt[index].classList.remove('toff-active');
            tfprt[index - 1].classList.add('toff-active');
            console.log(i);
            if(i !== tfprt.length - 1) {
                toffNextBtn.disabled = false;
            } else {
                toffNextBtn.disabled = true;
            }
            break;
        }
    }
});
