const loading = document.querySelector('.loading');
const splittedUrl = window.location.href.split('/');
const projectName = document.querySelector("#projectName");
const projectAddress = document.querySelector("#projectAddress");
const projectManagerSelector = document.querySelector("#projectManagers");
const parentProjectSelector = document.querySelector("#parentProjects");
const successAlertMessage = document.querySelector("#successAlertMessage");
const successAlertNotification = document.querySelector(".success-alert-notification");
const saveBtn = document.querySelector("#saveBtn");

const renderPage = () => {
    const projectId = splittedUrl[splittedUrl.length - 1];

    $.get(`http://localhost:3000/api/project/get-project/${projectId}`, (res) => {
        if (res.success === true) {
            const project = res.project[0];
            projectName.value = project.name;
            projectAddress.value = project.address;

            $.get('http://localhost:3000/api/project/project-managers-and-parent-projects', (result) => {
                const projectManagers = result.projectManagers;
                const parentProjects = result.parentProjects;
                let projectManagerHtml = `<option value="" hidden>Layihə meneceri seçin</option>`;
                let parentProjectHtml = `<option value="">Əsas Layihə</option>`;
                projectManagers.forEach(projectManager => {
                    if (projectManager.id === project.project_manager_id) {
                        projectManagerHtml += `
                            <option value="${projectManager.id}" selected>${projectManager.first_name} ${projectManager.last_name} ${projectManager.father_name}</option>
                        `;
                    } else {
                        projectManagerHtml += `
                            <option value="${projectManager.id}">${projectManager.first_name} ${projectManager.last_name} ${projectManager.father_name}</option>
                        `;
                    }
                });

                parentProjects.forEach(parentProject => {
                    if (project.parent_id === parentProject.id) {
                        parentProjectHtml += `
                            <option value="${parentProject.id}" selected>${parentProject.name}</option>
                        `;
                    } else {
                        parentProjectHtml += `
                            <option value="${parentProject.id}">${parentProject.name}</option>
                        `;
                    }
                });
                projectManagerSelector.innerHTML = projectManagerHtml;
                parentProjectSelector.innerHTML = parentProjectHtml;
            })
        } else {
            alert(res.message);
        }
    });

    saveBtn.addEventListener("click", () => {
        const name = projectName.value;
        const project_manager_id = projectManagerSelector.value;
        const address = projectAddress.value;
        const parent_id = parentProjectSelector.value;
        const project_id = projectId;
        
        $.post("http://localhost:3000/api/project/update", {
            name,
            project_manager_id,
            address,
            parent_id,
            project_id
        }, (res) => {
            console.log(res);
            if (res.success === true) {
                loading.classList.remove('d-none');
                successAlertMessage.innerHTML = "Yadda Saxlanıldı";
                successAlertNotification.classList.remove("d-none");
                setTimeout(() => {
                    successAlertNotification.classList.remove("opacity-hide");
                    successAlertNotification.classList.add("opacity-show");
                    loading.classList.add('d-none');
                    setTimeout(() => {
                        successAlertNotification.classList.remove("opacity-show");
                        successAlertNotification.classList.add("opacity-hide");
                        setTimeout(() => {
                            successAlertMessage.innerHTML = "";
                            successAlertNotification.classList.add("d-none");
                        }, 1000);
                    }, 1000);
                }, 1000);
            }
        });
    });
    loading.classList.add('d-none');
}

setTimeout(renderPage, 1000);