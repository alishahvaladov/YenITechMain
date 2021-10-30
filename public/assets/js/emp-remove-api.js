let empRemoveBtn = $(".empRmBtn");
let empCancelBtn = $(".empModalCancelBtn");

empCancelBtn.each(function () {
    $(this).on("click", () => {
        $(".modal-remove").removeClass("show-modal");
    });
});

empRemoveBtn.each(function (index) {
    $(this).on("click", () => {
        $("body").css("cursor", "progress");
        const id = $(this).val();
        $.post("http://localhost:3000/api/employee-data", {
            emp_id: id
        }, (res) => {
            const form = $("#remove-form");
            const result = res.result[0];
            const eName = $("#empName");
            const eSName = $("#empSName");
            const eFName = $("#empFName");
            const ePNumb = $("#empPNumber");
            const eDept = $("#empDeptName");
            const ePos = $("#empPosName");
            const eProj = $("#empProjName");

            form.attr("action", "/employee/remove/" + id.toString())
            eName.val(result.first_name);
            eSName.val(result.last_name);
            eFName.val(result.father_name);
            ePNumb.val(result.phone_number);
            eDept.val(result.deptName);
            ePos.val(result.posName);
            eProj.val(result.projName);
            $("body").css("cursor", "inherit");
            $(".modal-remove").addClass("show-modal");
        });
    });
});