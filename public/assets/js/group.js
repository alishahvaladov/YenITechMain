const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");

const renderPage = () => {
    $.get("/api/groups?offset=0", (res) => {
        const groups = res.groups;
        let html = "";

        groups.forEach(group => {
            html += `
                <tr>
                    <td>${group.name}</td>
                    <td>
                        <button class="btn btn-outline-secondary">Edit</button>
                    </td>
                </tr>
            `
        });

        tbody.innerHTML = html;
    });

    setTimeout(() => {
        loading.classList.add("d-none");
    }, 500);
}

renderPage();