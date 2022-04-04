const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const empInput = document.querySelector("#emp");
const uPayInput = document.querySelector("#u_pay")
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");

const search = () => {
    const emp = empInput.value;
    const uPay = uPayInput.value;
    const min = minInput.value;
    const max = maxInput.value;
    let html = "";
    $.post('http://localhost:3000/api/salary/search', {
        emp,
        uPay,
        min,
        max
    }, (sRes) => {
        let up = "";
        const salaries = sRes.result.salaries;
        console.log(salaries);
        salaries.forEach(salary => {
            if (salary.unofficial_pay === null) {
                up = '<span class="text-danger">Yoxdur</span>'
            } else {
                up = salary.unofficial_pay;
            }
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${up}</td>
                    <td>${salary.gross}</td>
                    <td></td>
                </tr>
            `
        });
        tbody.innerHTML = html;
    });
}

const renderPage = () => {
    $.get('http://localhost:3000/api/salary/all', (res) => {
        const result = res.result;
        let html = '';
        result.forEach(salary => {
            let up;
            if (salary.unofficial_pay === null) {
                up = '<span class="text-danger">Yoxdur</span>'
            } else {
                up = salary.unofficial_pay;
            }
            html += `
                <tr>
                    <td>${salary.first_name} ${salary.last_name} ${salary.father_name}</td>
                    <td>${up}</td>
                    <td>${salary.gross}</td>
                    <td class="text-center"><a class="btn btn-outline-secondary" href="#"><i class="bi bi-pencil"></i></a></td>
                </tr>
            `
        });
        tbody.innerHTML = html;        
        loading.classList.add('d-none');
    });
    empInput.addEventListener('keyup', () => {
        search();
    });
    uPayInput.addEventListener('change', () => {
        search();
    });
    maxInput.addEventListener('keyup', () => {
        search();
    });
    minInput.addEventListener('keyup', () => {
        search();
    });
}

setTimeout(renderPage, 1000);