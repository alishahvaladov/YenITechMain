const loading = document.querySelector(".loading");
const groupRightsCheckboxDiv = document.querySelector(".group-rights-checkbox");
const submitBtn = document.querySelector("#submitBtn");
const groupName = document.querySelector("#name");

const renderPage = () => {
    $.get("/api/access-groups/getRights", (res) => {
        const rights = res;
        let rightsHTML = "";

        rights.forEach(right => {
            rightsHTML += `
                <div class="group-right-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                    <input class="checkbox-list" type="checkbox" value="${right.id}">
                    <label class="mx-2">${right.name}</label>
                </div>
            `;
        });
        groupRightsCheckboxDiv.innerHTML = rightsHTML;
        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    });
}

submitBtn.addEventListener("click", () => {
    const checkboxLists = document.querySelectorAll(".checkbox-list");
    let arrayList = [];
    checkboxLists.forEach(list => {
        if (list.checked === true) {
            arrayList.push(list.value);
        };
    });
    $.ajax({
        url: "/api/access-groups/add",
        type: "POST",
        data: {
            name: groupName.value,
            groupId: arrayList
        }
    });
});

renderPage();