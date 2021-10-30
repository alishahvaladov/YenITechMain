const qEmp = $("#qEmployee");
const qProj = $("#qProject");
const qDept = $("#qDepartment");
const qPos = $("#qPosition");
const qTime = $("#qTime");
const qDay = $("#day");
const qMonth = $("#month");
const qYear = $("#year");

const search = () => {
    let qEmp = $("#qEmployee").val();
    let qProj = $("#qProject").val();
    let qDept = $("#qDepartment").val();
    let qPos = $("#qPosition").val();
    let qTime = $("#qTime").val();
    let qDay = $("#day").val();
    let qMonth = $("#month").val();
    let qYear = $("#year").val();

    console.log(qEmp);

    $.post("http://localhost:3000/api/fprints/search", {
        qEmployee: qEmp,
        qProject: qProj,
        qDepartment: qDept,
        qPosition: qPos,
        qTime: qTime,
        qDay: qDay,
        qMonth: qMonth,
        qYear: qYear
    }, (res) => {
        let result = res.result;
        let tbody = $("tbody");
        let trs = "";
        tbody.text("");
        for (let i = 0; i < result.length; i++) {
            const date = new Date(result[i].createdAt);
            let createdAt = date.toLocaleDateString();
            createdAt = createdAt.split('/');
            let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
            trs +=
                `
                    <tr>
                        <td>${result[i].first_name} ${result[i].last_name} ${result[i].father_name}</td>
                        <td>${result[i].projName}</td>
                        <td>${result[i].deptName}</td>
                        <td>${result[i].posName}</td>
                        <td>${result[i].f_print_time}</td>
                        <td>${updatedDate}</td>
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
qTime.keyup(search)
qDay.change(search)
qMonth.change(search)
qYear.change(search)