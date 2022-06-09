const loading = document.querySelector(".loading");
const projectsDiv = document.querySelector(".projects-checkbox");
const deptNameInput = document.querySelector('#deptName');
const saveDepartmentBtn = document.querySelector("#saveDepartment");
const url = window.location.href.split("/");
const id = url[url.length - 1];

const renderPage = () => {
    $.get(`http://localhost:3000/api/department/department-by-id/${id}`, (res) => {
        console.log(res);
        deptNameInput.value = res.name[0].name;
        const projects = res.projects;
        const projDept = res.proj_dept;
        let html = "";
        projects.forEach(project => {
            html += `
                <div class="project-checbox-list w-25 d-flex justify-content-center align-items-center">
                    <input class="checkbox-list" type="checkbox" value="${project.id}" id="${project.generatedId}">
                    <label class="mx-2" for="${project.generatedId}">${project.name}</label>
                </div>
            `;
        });
        projectsDiv.innerHTML = html;
        projDept.forEach(projDeptRel => {
            const checkBoxLists = document.querySelectorAll(".checkbox-list");
            checkBoxLists.forEach(checkBoxList => {
                if (parseInt(projDeptRel.project_id) === parseInt(checkBoxList.value)) {
                    checkBoxList.checked = true;
                }
            });
        });
        const checkBoxLists = document.querySelectorAll(".checkbox-list");
        checkBoxLists.forEach(checkBoxList => {
            checkBoxList.addEventListener("click", () => {
                $.get(`http://localhost:3000/api/department/update/project/${id}?project_id=${checkBoxList.value}`);
            });
        });
    });

    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);

saveDepartmentBtn.addEventListener("click", () => {
    $.get(`http://localhost:3000/api/department/update/name/${id}?name=${deptNameInput.value}`, (res) => {
        loading.classList.remove("d-none");
        setTimeout(renderPage, 1000);
    });
});