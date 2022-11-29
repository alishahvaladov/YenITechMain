const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");
const qName = document.querySelector("#qName");

const renderPage = (inputName = "") => {
    $.get(`/api/access-groups/all?name=${inputName}`, (res) => {
        const accessGroups = res.groups;
        const count = Math.ceil(parseInt(res.count[0].count) / 15);
        let tbodyHTML = "";

        accessGroups.forEach(group => {
            tbodyHTML += `
                <tr> 
                    <td>${group.name}</td>
                    <td>
                        <a href="/access-groups/update/${group.id}" class="btn btn-secondary">Edit</a>
                        <button class="btn btn-danger delete-btn" value="${group.id}">Delete</button>
                    </td>
                </tr>
            `
        });
        
        if (count <= 1) {
            pagination.classList.add("d-none");
        }

        tbody.innerHTML = tbodyHTML;

        const deleteBtns = document.querySelectorAll(".delete-btn");

        deleteBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                $.ajax({
                    url: `/api/access-groups/delete/${btn.value}`,
                    type: "POST",
                    data: {},
                    success: (() => {
                        loading.classList.remove("d-none");
                        renderPage();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            });
        })

        setTimeout(() => {
            loading.classList.add("d-none");
        }, 500);
    })
}

qName.addEventListener("keyup", () => {
    renderPage(qName.value);
})

renderPage();