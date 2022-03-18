const splittedURL = window.location.href.split("/");
const lastParam = splittedURL[splittedURL.length - 1];
const tbody = document.querySelector("tbody");
const loading = document.querySelector('.loading');
const empName = document.querySelector("#empName");

const renderPage = () => {
    $.get(`http://localhost:3000/api/fine/cumilative/${lastParam}`, (res) => {
        const result = res.result;
        let html = "";
        if (result.length > 0) {
            result.forEach(fprint => {
                console.log(fprint);
                const fprintDateObj = new Date(fprint.f_print_date).toLocaleDateString();
                let fprintDate = fprintDateObj.split("/");
                fprintDate = `${fprintDate[1]}.${fprintDate[0]}.${fprintDate[2]}`;
                html += ` 
                    <tr> 
                        <td>${fprintDate}</td>
                        <td>${fprint.f_print_time}</td>
                        <td>${fprint.calculatedMinute}</td>
                    </tr>
                `
            });
            tbody.innerHTML = html;
            empName.innerHTML = `(${result[0].first_name} ${result[0].last_name} ${result[0].father_name})`;
        }
        loading.classList.add('d-none');
    });
}

setTimeout(renderPage, 1500);