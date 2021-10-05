const empSelector = $("#toff-maker");

empSelector.change(function () {
    let id = empSelector.val();
    let department = $("#toff-department");
    let project = $("#toff-branch");
    let position = $("#toff-emp-position");

    $.post("http://localhost:3000/api/time-off/emp-info", {
        id: id
    }, (res) => {
        console.log(res.result[0]);
        department.val(res.result[0].depName);
        project.val(res.result[0].projName);
        position.val(res.result[0].posName);
    })
});