const splittedURL = window.location.href.split("/");
const lastParam = splittedURL[splittedURL.length - 1];
const tbody = document.querySelector("tbody");
const loading = document.querySelector('.loading')

const renderPage = () => {
    $.get(`http://localhost:3000/api/fine/cumilative/${lastParam}`, (res) => {
        const result = res.result;
        let html = "";
        result.forEach(fprint => {
            console.log(fprint);
            html += ` 
                <tr> 
                    <td>${fprint.f_print_date}</td>
                    <td>${fprint.f_print_time}</td>
                </tr>
            `
        });
        tbody.innerHTML = html;
        loading.classList.add('d-none');
    });
}

setTimeout(renderPage, 1500)