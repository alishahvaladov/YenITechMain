const loading = document.querySelector(".loading");
const url = window.location.href.split("/");
const id = url[url.length - 1];
const departmentsChecboxDiv = document.querySelector(".departments-checkbox");
const groupNameInput = document.querySelector("#name");
const saveBtn = document.querySelector("#saveBtn");

const renderPage = () => {
    $.get(`/api/groups/edit?id=${id}`, (res) => {
        console.log(res);
        const departments = res.departments;
        const deptByGroups = res.deptByGroups;
        groupNameInput.value = res.groupName;

        let deptHTML = "";

        departments.forEach(department => {
            deptHTML += `
                <div class="group-right-checbox-list w-25 d-flex justify-content-left my-2 align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${department.id}">
                    <label class="mx-2">${department.name}</label>
                </div>
            `;
        });

        departmentsChecboxDiv.innerHTML = deptHTML;

        const checkboxLists = document.querySelectorAll(".checkbox-list");

        checkboxLists.forEach(list => {
            deptByGroups.forEach(dbg => {
                if (dbg.department_id == list.value) {
                    list.checked = true;
                }
            });
            list.addEventListener("click", () => {
                if (list.checked === true) {
                    $.ajax({
                        url: `/api/groups/addDepartmentToGroup?department_id=${list.value}&group_id=${id}`,
                        type: "POST",
                        success: ((res) => {
                            loading.classList.remove("d-none");
                            setTimeout(() => {
                                renderPage();
                            }, 300);
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    $.ajax({
                        url: `/api/groups/deleteDepartmentFromGroup?department_id=${list.value}&group_id=${id}`,
                        type: "POST",
                        success: ((res) => {
                            loading.classList.remove("d-none");
                            setTimeout(() => {
                                renderPage();
                            }, 300);
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        });

        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    })
}

saveBtn.addEventListener("click", () => {
    $.ajax({
        url: `/api/groups/update/name?id=${id}&groupName=${groupNameInput.value}`,
        type: "POST",
        success: ((res) => {
            loading.classList.remove("d-none");
            setTimeout(() => {
                renderPage();
            }, 400);
        })
    }).catch((err) => {
        console.log(err);
    })
})

renderPage();