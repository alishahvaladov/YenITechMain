const groupsDiv = document.querySelector(".departments-checkbox");
const submitPositionBtn = document.querySelector("#submitPosition");
const inputPassword4 = document.querySelector("#name");
const successModal = document.querySelector(".success-modal");
const errorModal = document.querySelector('.error-modal');
const errorMessage = document.querySelector("#errorMessage");
const loading = document.querySelector(".loading");


const renderPage = () => {

    $.get("/api/position", (res) => {
        const groups = res.result;
        let html = "";
        console.log(groups);
        groups.forEach(group => {
            html += `
                <div class="project-checbox-list w-25 d-flex justify-content-left my-2 align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${group.id}" id="${group.generatedId}">
                    <label class="mx-2" for="${group.generatedId}">${group.name}</label>
                </div>
            `
        });
        groupsDiv.innerHTML = html;
        
        submitPositionBtn.addEventListener("click", () => {
            let checkedArray = [];
            const groupCheckBoxes = document.querySelectorAll(".checkbox-list:checked");
            let posName = inputPassword4.value;
            groupCheckBoxes.forEach(checkedGroup => {
                checkedArray.push(checkedGroup.value);
            });
            $.post("/api/position/add-position", {
                posName: posName,
                groups: checkedArray
            }, (res) => {
                console.log(res);
                $(".success-modal").fadeIn();
                setTimeout(() => {
                    location.href = "/positions";
                }, 700);
            }).catch(e => {
                errorMessage.innerHTML = e.responseJSON.message;
                $('.error-modal').fadeIn();
                setTimeout(() => {
                    $('.error-modal').fadeOut();    
                }, 1000);
            })
        });
    });

    loading.classList.add("d-none");
}


setTimeout(renderPage, 1000);
