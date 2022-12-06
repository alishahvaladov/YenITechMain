const loading = document.querySelector(".loading");
const groupRightsCheckboxDiv = document.querySelector(".group-rights-checkbox");
const groupNavbarCheckboxDiv = document.querySelector(".navbar-rights-checkbox");
const submitBtn = document.querySelector("#submitBtn");
const groupName = document.querySelector("#name");
const errorModal = document.querySelector(".error-modal");
const successModal = document.querySelector(".success-modal");
const errorMessage = document.querySelector("#errorMessage");
const body = document.querySelector("body");

const renderPage = () => {
    $.get("/api/access-groups/getRights", (res) => {
        const rights = res.rights;
        const navbars = res.navbars;
        console.log(res);
        let rightsHTML = "";
        let navbarHTML = "";

        rights.forEach(right => {
            rightsHTML += `
                <div class="group-right-checbox-list w-50 d-flex justify-content-left mb-2 align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${right.id}">
                    <label class="mx-2">${right.name}</label>
                </div>
            `;
        });

        navbars.forEach(menu => {
            navbarHTML += `
                <div class="navbar-right-checbox-list w-50 d-flex justify-content-left mb-2 align-items-center"> 
                    <input class="navbar-checkbox-list" type="checkbox" value="${menu.id}">
                    <label class="mx-2">${menu.name}</label>
                </div>
            `;
        });

        groupRightsCheckboxDiv.innerHTML = rightsHTML;
        groupNavbarCheckboxDiv.innerHTML = navbarHTML;
        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    });
}

submitBtn.addEventListener("click", () => {
    const checkboxLists = document.querySelectorAll(".checkbox-list");
    const menuCheckboxLists = document.querySelectorAll(".navbar-checkbox-list");

    let arrayList = [];
    const menuArrayList = [];
    checkboxLists.forEach(list => {
        if (list.checked === true) {
            arrayList.push(list.value);
        };
    });
    menuCheckboxLists.forEach(menu => {
        if (menu.checked === true) {
            menuArrayList.push(menu.value);
        }
    })
    
    $.ajax({
        url: "/api/access-groups/add",
        type: "POST",
        data: {
            name: groupName.value,
            rightId: arrayList,
            navbarIDs: menuArrayList
        },
        success: (() => {
            body.style.cursor = "wait";
            loading.classList.remove("d-none");
            successModal.style.display = "flex";
            setTimeout(() => {
                window.location.href = "/access-groups";
            }, 500)
        })
    }).catch((err) => {
        if (err) {
            errorModal.style.display = "flex";
            errorMessage.innerHTML = err.responseJSON.message;
            setTimeout(() => {
                errorModal.style.display = "none";
                errorMessage.innerHTML = "";
            }, 1000)
        }
    });
});

renderPage();