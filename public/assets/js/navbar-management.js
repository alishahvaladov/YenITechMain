const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");

const renderPage = (inputName = "") => {
    $.get('/api/navbar-management', (res) => {
        const navbars = res.navbars;
        const count = Math.ceil(parseInt(res.count[0].count) / 15);
        let navbarHTML = "";
        navbars.forEach(navbar => {
            navbarHTML += `
                <tr>
                    <td>${navbar.name}</td>
                    <td>
                        <a href="/navbar-management/edit/${navbar.id}" class="btn btn-secondary">Edit</a>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = navbarHTML;

        if (count <= 1) {
            pagination.classList.add("d-none");
        }
    });

    setTimeout(() => {
        loading.classList.add("d-none");
    }, 500);
}

renderPage();