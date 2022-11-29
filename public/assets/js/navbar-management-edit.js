const loading = document.querySelector(".loading");
const navbarManagementDiv = document.querySelector(".navbar-checkbox");
const menuName = document.querySelector("#name");
const loc = window.location.href.split("/")
const id = loc[loc.length - 1];

const renderPage = () => {
        $.get(`/api/navbar-management/groups?id=${id}`, (res) => {
            menuName.value = res.navbarName;
            const groups = res.groups;
            const activeGroups = res.activeGroups;
            let html = "";
            groups.forEach(group => {
                html += `
                    <div class="group-right-checbox-list w-25 d-flex justify-content-center align-items-center"> 
                        <input class="checkbox-list" type="checkbox" value="${group.id}">
                        <label class="mx-2">${group.name}</label>
                    </div>
                `;
            });
            navbarManagementDiv.innerHTML = html;

            const checkboxLists = document.querySelectorAll(".checkbox-list");

            checkboxLists.forEach(list => {
                activeGroups.forEach(group => {
                    if (group.agroup_id === parseInt(list.value)) {
                        list.checked = true;
                    }
                });
                list.addEventListener("change", () => {
                    if (list.checked === true) {
                        $.post(`/api/navbar-management/add?nav_id=${id}&agroup_id=${list.value}`);
                    } else {
                        $.post(`/api/navbar-management/remove?nav_id=${id}&agroup_id=${list.value}`);
                    }
                    loading.classList.remove("d-none");
                    setTimeout(() => {
                        renderPage();
                    }, 500);
                });
            });
            setTimeout(() => {
                loading.classList.add("d-none");
            }, 500);
        });
}

renderPage();