const loading = document.querySelector('.loading');
const projectManagerSelector = document.querySelector("#projectManagers");
const parentProjectSelector = document.querySelector("#parentProjects");

const renderPage = () => {
    $.get('http://localhost:3000/api/project/project-managers-and-parent-projects', (res) => {
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

setTimeout(renderPage, 1000);