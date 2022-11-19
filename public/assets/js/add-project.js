const loading = document.querySelector('.loading');
const projectManagerSelector = document.querySelector("#project_manager_id");
const parentProjectSelector = document.querySelector("#parent_id");
const nameInput = document.querySelector("#name");
const addressInput = document.querySelector("#address");
const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector(".successfull-added-modal");
const inputFields = document.querySelectorAll(".form-control");
const selectFields = document.querySelectorAll(".form-select");

const renderPage = () => {
    $.get('/api/project/project-managers-and-parent-projects', (res) => {
        const projectManagers = res.projectManagers;
        const parentProjects = res.parentProjects;
        let projectManagerHtml = `<option value="" hidden>Layihə meneceri seçin</option>`;
        let parentProjectHtml = `<option value="" selected>Əsas layihə</option>`;
        projectManagers.forEach(projectManager => {
            projectManagerHtml += `
                <option value=${projectManager.id}>${projectManager.first_name} ${projectManager.last_name} ${projectManager.father_name}</option>
            `;
        })
        parentProjects.forEach(parentProject => {
            parentProjectHtml += `
                <option value="${parentProject.id}">${parentProject.name}</option>
            `
        });

        projectManagerSelector.innerHTML = projectManagerHtml;
        parentProjectSelector.innerHTML = parentProjectHtml;
    });

    loading.classList.add('d-none');
}
submitBtn.addEventListener("click", () => {
    document.querySelector("body").style.cursor = "wait";
    console.log(nameInput.value);
    $.ajax({
        type: "post",
        url: "/api/project/add-project",
        data: {
            name: nameInput.value,
            address: addressInput.value,
            project_manager_id: projectManagerSelector.value,
            parent_id: parentProjectSelector.value
        },
        success: ((res) => {
            successModal.classList.remove("d-none");
            setTimeout(() => {
                successModal.classList.remove("opacity-hide");
                successModal.classList.add("opacity-show");
            }, 1);
            setTimeout(() => {
                loading.classList.remove("d-none");
                successModal.classList.remove("opacity-show");
                successModal.classList.add("opacity-hide");
                inputFields.forEach(field => {
                    field.value = "";
                });
                selectFields.forEach(field => {
                    field.selectedIndex = 0;
                });
                setTimeout(() => {
                    loading.classList.add("d-none");
                    document.querySelector("body").style.cursor = "inherit";
                    successModal.classList.add("d-none");
                }, 1000);
            }, 1000);
        })
    }).catch((err) => {
        const message = err.responseJSON.message;
        const field = err.responseJSON.field
        const label = document.querySelector(`label[for="${field}"]`);
        const inputField = document.querySelector(`#${field}`);
        label.classList.add("error-label");
        const labelHTML = label.innerHTML;
        label.innerHTML = `${labelHTML}: <span>${message}</span>`
        inputField.addEventListener("click", () => {
            label.classList.remove("error-label");
            label.innerHTML = labelHTML;
        })
        setTimeout(() => {
            loading.classList.add("d-none");
            document.querySelector("body").style.cursor = "inherit";
        }, 1000);
    });
});



setTimeout(renderPage, 1000);