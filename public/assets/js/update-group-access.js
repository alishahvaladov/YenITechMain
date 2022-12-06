const loading = document.querySelector(".loading");
const groupRightsCheckboxDiv = document.querySelector(".group-rights-checkbox");
const groupNavbarCheckboxDiv = document.querySelector(".navbar-rights-checkbox");
const url = window.location.href.split("/");
const id = url[url.length - 1];
const nameInput = document.querySelector("#name");

const renderPage = () => {

    $.get("/api/access-groups/getRights", (res) => {
        const rights = res.rights;
        const navbars = res.navbars;
        let rightsHTML = "";
        let navbarHTML = "";
        $.get(`/api/access-groups/findById/${id}`, (byIdRes) => {
            const currentGroup = byIdRes.group;
            nameInput.value = currentGroup.name;
            const currentRights = currentGroup.Rights;
            const currentNavbars = byIdRes.navbar;
            rights.forEach(right => {
                rightsHTML += `
                    <div class="group-right-checbox-list w-50 d-flex justify-content-left align-items-center my-2"> 
                        <input class="checkbox-list" type="checkbox" value="${right.id}">
                        <label class="mx-2">${right.name}</label>
                    </div>
                `;
            });

            navbars.forEach(navbar => {
                navbarHTML += `
                    <div class="navbar-right-checbox-list w-50 d-flex justify-content-left align-items-center my-2"> 
                        <input class="navbar-checkbox-list" type="checkbox" value="${navbar.id}">
                        <label class="mx-2">${navbar.name}</label>
                    </div>
                `;
            });

            groupRightsCheckboxDiv.innerHTML = rightsHTML;
            groupNavbarCheckboxDiv.innerHTML = navbarHTML;

            const checkboxLists = document.querySelectorAll(".checkbox-list");
            const navbarCheckboxLists = document.querySelectorAll(".navbar-checkbox-list");

            currentRights.forEach(right => {
                checkboxLists.forEach(list => {
                    if (parseInt(list.value) === parseInt(right.id)) {
                        list.checked = true;
                    }
                });
            });

            currentNavbars.forEach(menu => {
                navbarCheckboxLists.forEach(list => {
                    if (parseInt(list.value) === parseInt(menu.nav_id)) {
                        list.checked = true;
                    }
                })
            });

            navbarCheckboxLists.forEach(list => {
                list.addEventListener("change", () => {
                    if (list.checked === true) {
                        $.ajax({
                            url: "/api/access-groups/menus/add",
                            type: "POST",
                            data: {
                                nav_id: list.value,
                                agroup_id: id
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
                            url: "/api/access-groups/menus/remove",
                            type: "POST",
                            data: {
                                nav_id: list.value,
                                agroup_id: id
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