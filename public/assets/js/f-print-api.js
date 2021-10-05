const qEmp = $("#qEmployee");
const qProj = $("#qProject");
const qDept = $("#qDepartment");
const qPos = $("#qPosition");
const qEnter = $("#qEnter");
const qLeave = $("#qLeave");
const qDate = $("#qDate");


const search = () => {
    let qEmp = $("#qEmployee").val();
    let qProj = $("#qProject").val();
    let qDept = $("#qDepartment").val();
    let qPos = $("#qPosition").val();
    let qEnter = $("#qEnter").val();
    let qLeave = $("#qLeave").val();
    let qDate = $("#qDate").val();

    console.log(qEmp);

    $.post("http://localhost:3000/api/fprints/search", {
        qEmployee: qEmp,
        qProject: qProj,
        qDepartment: qDept,
        qPosition: qPos,
        qEnter: qEnter,
        qLeave: qLeave,
        qDate: qDate
    }, (res) => {
        let result = res.result;
        let tbody = $("tbody");
        let trs = "";
        tbody.text("");
        for (let i = 0; i < result.length; i++) {
            const date = new Date(result[i].createdAt);
            let createdAt = date.toLocaleDateString();
            trs +=
                `
                    <tr>
                        <td>${result[i].first_name} ${result[i].last_name} ${result[i].father_name}</td>
                        <td>${result[i].projName}</td>
                        <td>${result[i].deptName}</td>
                        <td>${result[i].posName}</td>
                        <td>${result[i].f_enter}</td>
                        <td class="text-success">${result[i].f_leave}</td>
                        <td>${createdAt}</td>
                        <td></td>
                    </tr>
                `
        }
        if(trs.length !== 0) {
            tbody.html(trs);
        } else {
            tbody.text("No Data Found");
        }
    })
}

qEmp.keyup(search)
qProj.keyup(search)
qDept.keyup(search)
qPos.keyup(search)
qEnter.keyup(search)
qLeave.keyup(search)
qDate.keyup(search)