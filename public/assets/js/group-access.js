const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");

const renderPage = () => {
    $.get("/api/access-groups/all", (res) => {
        const accessGroups = res;
        let tbodyHTML = "";

        accessGroups.forEach(group => {
            tbodyHTML += `
                <tr> 
                    <td>${group.name}</td>
                    <td>
                        <a href="/access-groups/update/${group.id}" class="btn btn-secondary">Edit</a>
                        <button class="btn btn-danger" value="${group.id}">Delete</button>
                    </td>
                </tr>
            `
        });

        tbody.innerHTML = tbodyHTML;

        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    })
}


renderPage();