const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");

const renderPage = () => {

    $.get("/api/groups?offset=0", (res) => {
        console.log(res);
        const groups = res.groups;
        let html = "";

        groups.forEach(group => {
            html += `
                <tr>
                    <td>${group.name}</td>
                    <td>
                        <button></button>
                    </td>
                </tr>
            `
        });
    })

    setTimeout(() => {
        loading.classList.add("d-none");
    }, 500);
}

renderPage();