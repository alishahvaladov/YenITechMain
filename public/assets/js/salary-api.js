const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');

const renderPage = () => {
    $.get('http://localhost:3000/api/salary/all', (res) => {
        const result = res.result;
        console.log(result);
        let html = '';
        result.forEach(salary => {
            let un;
            if (salary.unofficial_net === null) {
                un = '<span class="text-danger">Yoxdur</span>'
            } else {
                un = salary.unofficial_net;
            }
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${un}</td>
                    <td>${salary.gross}</td>
                    <td class="text-center"><a class="btn btn-outline-secondary" href="#"><i class="bi bi-pencil"></i></a></td>
                </tr>
            `
        });
        tbody.innerHTML = html;        
        loading.classList.add('d-none');
    })
}

renderPage();