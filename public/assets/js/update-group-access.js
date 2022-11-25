const loading = document.querySelector(".loading");
const groupRightsCheckboxDiv = document.querySelector(".group-rights-checkbox");
const url = window.location.href.split("/");
const id = url[url.length - 1];
const nameInput = document.querySelector("#name");

const renderPage = () => {

    $.get("/api/access-groups/getRights", (res) => {
        const rights = res;
        let rightsHTML = "";
        $.get(`/api/access-groups/findById/${id}`, (byIdRes) => {
            const currentGroup = byIdRes;
            nameInput.value = currentGroup.name;
            const currentRights = byIdRes.Rights;
            rights.forEach(right => {
                rightsHTML += `
                    <div class="group-right-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                        <input class="checkbox-list" type="checkbox" value="${right.id}">
                        <label class="mx-2">${right.name}</label>
                    </div>
                `;
            });
            groupRightsCheckboxDiv.innerHTML = rightsHTML;

            const checkboxLists = document.querySelectorAll(".checkbox-list");

            currentRights.forEach(right => {
                checkboxLists.forEach(list => {
                    if (parseInt(list.value) === parseInt(right.id)) {
                        list.checked = true;
                    }
                });
            });

            checkboxLists.forEach(list => {
                list.addEventListener("change", () => {
                    if (list.checked === true) {
                        $.ajax({
                            url: "/api/access-groups/addRole",
                            type: "POST",
                            data: {
                                rightId: list.value,
                                groupId: id
                            },
                            success: ((res) => {
                                loading.classList.remove("d-none");
                                setTimeout(() => {
                                    renderPage();
                                }, 500);
                            })
                        }).catch((err) => {
                            console.log(err);
                        });
                    } else {
                        $.ajax({
                            url: "/api/access-groups/deleteRole",
                            type: "POST",
                            data: {
                                rightId: list.value,
                                groupId: id
                            },
                            success: ((result) => {
                                console.log(result);
                                loading.classList.remove("d-none");
                                setTimeout(() => {
                                    renderPage();
                                }, 500);
                            })
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                });
            });

            setTimeout(() => {
                loading.classList.add("d-none");
            }, 500);
        });
    });
}


renderPage();