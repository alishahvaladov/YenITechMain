const loading = document.querySelector(".loading");
const departmentsDiv = document.querySelector(".departments-checkbox");
const inputName = document.querySelector("#name");
const submitGroupBtn = document.querySelector("#submitGroup");

const renderPage = () => {
    $.get("/api/groups/departments", (res) => {
        console.log(res);
        const departments = res.departments;
        let html = "";
        departments.forEach(department => {
            html += `
                <div class="department-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${department.id}" id="${department.id}">
                    <label class="mx-2" for="${department.id}">${department.name}</label>
                </div>
            `
        });
        departmentsDiv.innerHTML = html;

    });
    setTimeout(() => {
        loading.classList.add("d-none");
    }, 500);
}

submitGroupBtn.addEventListener("click", () => {
    const checkedArray = [];
    const checkedLists = document.querySelectorAll(".checkbox-list:checked");
    checkedLists.forEach(list => {
        checkedArray.push(list.value);
    })
    $.post(`/api/groups/add`, {
        name: inputName.value,
        departments: checkedArray
    }, (res) => {
        console.log(res);
    });
});

renderPage();