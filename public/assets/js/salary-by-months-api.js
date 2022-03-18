const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const exportBtn = document.querySelector('#export');

const renderPage = () => {
    $.get('http://localhost:3000/api/salary/salary-by-months', (res) => {
        const result = res.result;
        console.log(result);
        let html = "";
        result.forEach(salary => {
            html += ` 
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${salary.salary_cost}</td>
                    <td>${salary.salary_date}</td>
                    <td></td>
                </tr>
            ` 
        });
        tbody.innerHTML = html;
        loading.classList.add('d-none');
    });
    exportBtn.addEventListener('click', () => {
        let method = 'get';
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/api/salary/export-to-excel");
        document.body.appendChild(form);
        form.submit();
    });
}

renderPage();