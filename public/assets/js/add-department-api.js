const projectsDiv = document.querySelector(".projects-checkbox");
const submitDepartmentBtn = document.querySelector("#submitDepartment");
const inputPassword4 = document.querySelector("#inputPassword4");
const body = document.querySelector("body");
const loading = document.querySelector(".loading");


const renderPage = () => {
    $.get("/api/department", (res) => {
        const projects = res.result;
        let html = "";
        console.log(projects);
        projects.forEach(project => {
            html += `
                <div class="project-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${project.id}" id="${project.generatedId}">
                    <label class="mx-2" for="${project.generatedId}">${project.name}</label>
                </div>
            `
        });
        projectsDiv.innerHTML = html;
        
        submitDepartmentBtn.addEventListener("click", () => {
            let checkedArray = [];
            const projectCheckBoxes = document.querySelectorAll(".checkbox-list:checked");
            let deptName = inputPassword4.value;
            console.log(checkedArray.length);
            projectCheckBoxes.forEach(checkedProject => {
                checkedArray.push(checkedProject.value);
            });
            $.post("/api/department/add-department", {
                departmentName: deptName,
                projects: checkedArray
            }, (res) => {
                body.style.cursor = "progress";
                setTimeout(() => {
                    location.href = "/department";
                }, 1000);
            }).catch(e => {
                alert(e.responseJSON.message);
            })
        });
    });

    loading.classList.add('d-none');
}

setTimeout(renderPage, 1000);