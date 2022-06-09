const loading = document.querySelector(".loading");
const positionNameInput = document.querySelector("#positionName");
const departmentsDiv = document.querySelector(".departments-checkbox");
const submitPositionBtn = document.querySelector("#submitPosition");

let url = window.location.href;
url = url.split("/");
const id = url[url.length - 1];

const renderPage = () => {
    const url = window.location.href.split('/')
    const id = url[url.length - 1];
    $.get(`http://localhost:3000/api/position/position-by-id/${id}`, (res) => {
        positionNameInput.value = res.name[0].name;
        const departments = res.departments;
        const deptPosRel = res.dept_pos;
        let html = "";
        departments.forEach(department => {
            html += `
                <div class="project-checkbox-list w-25 d-flex justify-content-center align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${department.id}" id="${department.generatedId}">
                    <label class="mx-2" for="${department.generatedId}">${department.name}</label>
                </div>
            `;
        });

        departmentsDiv.innerHTML = html;
        deptPosRel.forEach(deptPos => {
            const checkBoxLists = document.querySelectorAll(".checkbox-list");
            checkBoxLists.forEach(checkBoxList => {
                if (parseInt(deptPos.department_id) === parseInt(checkBoxList.value)) {
                    checkBoxList.checked = true;
                }
                checkBoxList.addEventListener("click", () => {
                    const department_id = checkBoxList.value;
                    $.get(`http://localhost:3000/api/position/update/department?position_id=${id}&department_id=${department_id}`)
                });
            });
        });
    })
    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);

submitPositionBtn.addEventListener("click", () => {
    const name = positionNameInput.value;
    $.get(`http://localhost:3000/api/position/update/name/${id}?name=${name}`);
    loading.classList.remove("d-none");
    setTimeout(renderPage, 500);
});