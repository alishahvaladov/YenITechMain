const loading = document.querySelector(".loading");
const empSelector = document.querySelector("#empSelect");
const groupSelector = document.querySelector("#groupSelector");

const renderPage = () => {
    $.get("/api/users/non-existing-users", (res) => {
        const employees = res.employees;
        const accessGroups = res.accessGroups;
        let empHtml = `<option value="0" hidden>Choose Name</option>`;
        let groupHTML = `<option value="0" hidden>Choose Group</option>`;

        employees.forEach(employee => {
            empHtml += `
                <option value="${employee.id}">${employee.first_name} ${employee.last_name} ${employee.father_name}</option>
            `;
        });

        accessGroups.forEach(group => {
            groupHTML += `
                <option value="${group.id}">${group.name}</option>
            `;
        });

        groupSelector.innerHTML = groupHTML;
        empSelector.innerHTML = empHtml;
        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    })
}

renderPage();