const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const exportBtn = document.querySelector('#export');
const empInput = document.querySelector("#emp");
const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const monthSelect = document.querySelector("#month");
const yearSelect = document.querySelector("#year");
const resetDate = document.querySelector("#resetDate");
const dateNow = new Date();
const year = dateNow.getFullYear();

const resetDateSelect = () => {
    const monthHtml = `
        <option hidden>Ay</option>
        <option value="1">Yanvar</option>
        <option value="2">Fevral</option>
        <option value="3">Mart</option>
        <option value="4">Aprel</option>
        <option value="5">May</option>
        <option value="6">İyun</option>
        <option value="7">İyul</option>
        <option value="8">Avqust</option>
        <option value="9">Sentyabr</option>
        <option value="10">Oktyabr</option>
        <option value="11">Noyabr</option>
        <option value="12">Dekabr</option>
    `
    let yearSelectHtml = "<option hidden>İl</option>";
    for (let i = year; i > year - 30; i--) {
        yearSelectHtml += `
            <option value=${i}>${i}</option>
        `
    }
    monthSelect.innerHTML = monthHtml;
    yearSelect.innerHTML = yearSelectHtml
}
const search = () => {
    const emp = empInput.value;
    const min = minInput.value;
    const max = maxInput.value;
    const month = monthSelect.value;
    const year = yearSelect.value;
    let html = "";
    $.post('http://localhost:3000/api/salary/search-salary-by-months', {
        emp,
        min,
        max,
        month,
        year
    }, (sRes) => {
        console.log(sRes);
        const salaries = sRes.result.salaries;
        salaries.forEach(salary => {
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
    });
}
const renderPage = () => {
    resetDateSelect();
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
    empInput.addEventListener('keyup', () => {
        search();
    });
    minInput.addEventListener('keyup', () => {
        search();
    });
    maxInput.addEventListener('keyup', () => {
        search();
    });
    monthSelect.addEventListener('change', () => {
        search();
    });
    yearSelect.addEventListener('change', () => {
        search();
    });
    
    resetDate.addEventListener("click", () => {
        resetDateSelect();
        search();
    });
}

setTimeout(renderPage, 1000)