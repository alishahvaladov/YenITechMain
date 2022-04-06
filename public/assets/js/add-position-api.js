const departmentsDiv = document.querySelector(".departments");
const submitPositionBtn = document.querySelector("#submitPosition");
const inputPassword4 = document.querySelector("#inputPassword4");
const successModal = document.querySelector(".success-modal");
const errorModal = document.querySelector('.error-modal');
const errorMessage = document.querySelector("#errorMessage");



$.get("http://localhost:3000/api/position", (res) => {
    const departments = res.result;
    let html = "";
    console.log(departments);
    departments.forEach(department => {
        html += `
            <div class="project-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                <input class="checkbox-list" type="checkbox" value="${department.id}" id="${department.generatedId}">
                <label class="mx-2" for="${department.generatedId}">${department.name}</label>
            </div>
        `
    });
    departmentsDiv.innerHTML = html;
    
    submitPositionBtn.addEventListener("click", () => {
        let checkedArray = [];
        const departmentCheckBoxes = document.querySelectorAll(".checkbox-list:checked");
        let posName = inputPassword4.value;
        console.log(checkedArray.length);
        departmentCheckBoxes.forEach(checkedProject => {
            checkedArray.push(checkedProject.value);
        });
        $.post("http://localhost:3000/api/position/add-position", {
            posName: posName,
            departments: checkedArray
        }, (res) => {
            console.log(res);
            $(".success-modal").fadeIn();
            setTimeout(() => {
                location.href = "http://localhost:3000/positions";
            }, 700);
        }).catch(e => {
            errorMessage.innerHTML = e.responseJSON.message;
            $('.error-modal').fadeIn();
            setTimeout(() => {
                $('.error-modal').fadeOut();    
            }, 1000);
        })
    });
})