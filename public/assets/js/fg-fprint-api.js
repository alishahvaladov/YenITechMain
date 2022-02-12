const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");

const renderPage = () => {
    $.get("http://localhost:3000/api/fprints/inappropriate-fprints", (res) => {
        const result = res.result;
        let html = "";
        result.forEach(item => {
            if(item.f_print_date_entrance === null) {
                item.f_print_date_entrance = `<button class="btn btn-outline-success">Vaxt əlavə et</button>`;
            } else if (item.f_print_date_exit === null) {
                item.f_print_date_exit = `<button class="btn btn-outline-success">Vaxt əlavə et</button>`;
            }
            html += `
                <tr> 
                    <td>${item.first_name} ${item.last_name} ${item.father_name}</td>
                    <td>${item.f_print_date_entrance}</td>
                    <td>${item.f_print_date_exit}</td>
                    <td>${item.f_print_time}</td>
                </tr>
            `
        });
        tbody.innerHTML = html;
        loading.classList.remove("d-flex");
        loading.classList.add("d-none");
    });
}

setTimeout(renderPage, 1500);