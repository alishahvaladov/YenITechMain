const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");
const pgContatiner = document.querySelector(".pagination-container");
const pagination = document.querySelector(".pagination");
const exportToExcelBtn = document.querySelector("#exportToExcel");

const qNameInput = document.querySelector("#qName");

let qName;

const getSearchData = () => {
    qName = qNameInput.value;
}


const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    pgItems.forEach(item => {
        item.addEventListener("click", () => {
            loading.classList.remove('d-none');
            let offset = parseInt(item.value) - 1;
            let activeClass = document.querySelector('.pagination-active');
            let index = pgItems.indexOf(activeClass);
            pgItems[index].classList.remove('pagination-active');
            item.classList.add('pagination-active');
            activeClass = document.querySelector('.pagination-active');
            index = pgItems.indexOf(activeClass);
            if(pgItems.length > 21) {
                if(index > 9 && index < pgItems.length - 10) {
                    fTDots.classList.remove('d-none');
                    lTDots.classList.remove('d-none');
                    for(let i = 1; i < pgItems.length - 1; i++) {
                        pgItems[i].classList.add('d-none');
                    }
                    for (let i = index; i > index - 9; i--) {
                        if (i < 1) {
                            break;
                        }
                        pgItems[i].classList.remove('d-none')
                    }
                    for (let i = index; i < index + 9; i++) {
                        pgItems[i].classList.remove('d-none');
                    }
                } else if (index <= 9) {
                    fTDots.classList.add('d-none');
                    lTDots.classList.remove('d-none');
                    for (let i = 21; i < pgItems.length - 2; i++) {
                        pgItems[i].classList.add('d-none')
                    }
                    for (let i = 1; i < 21; i++) {
                        pgItems[i].classList.remove('d-none');
                    }
                } else {
                    lTDots.classList.add('d-none');
                    fTDots.classList.remove('d-none');
                    for (let i = 1; i < pgItems.length - 20; i++) {
                        pgItems[i].classList.add('d-none');
                    }
                    for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                        pgItems[i].classList.remove('d-none');
                    }
                }
            }
            setTimeout(() => {
                getSearchData();
                $.post(`/api/position/allPositions/${offset}`, {
                    qName
                }, (res) => {
                    let tbody = document.querySelector("tbody");
                    let html = "";
                    const positions = res.positions;
                    console.log(res);
                    positions.forEach(position => {
                        html += `
                        <tr>
                            <td>${position.name}</td>
                            <td>
                                <div class="btn-group w-100">
                                    <a class="btn btn-outline-danger" href="/positions/delete/${position.id}"><i class="bi bi-x-circle"></i></a>
                                    <a class="btn btn-outline-secondary" href="/positions/update/${position.id}"><i class="bi bi-pencil-square"></i></a>
                                </div>
                            </td>
                        </tr>
                        `
                    });
                    tbody.innerHTML = html;
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    });
}

const renderPage = () => {
    let html = "";
    getSearchData();
    $.post("/api/position/allPositions/0", {
        qName
    }, (res) => {
        const positions = res.positions;
        let count = res.count[0].count;
        count = Math.ceil(count / 15);
        positions.forEach(position => {
            html += `
                <tr>
                    <td>${position.name}</td>
                    <td>
                        <div class="btn-group w-100">
                            <a class="btn btn-outline-danger" href="/positions/delete/${position.id}"><i class="bi bi-x-circle"></i></a>
                            <a class="btn btn-outline-secondary" href="/positions/update/${position.id}"><i class="bi bi-pencil-square"></i></a>
                        </div>
                    </td>
                </tr>
            `
        });
        tbody.innerHTML = html;
        loading.classList.add('d-none');

        if (count > 1) {
            pagination.classList.remove('d-none');
            let countHtml = "";

            for (let i = 1; i <= count; i++) {
                if (i === 1) {
                    countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                    countHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                }
                if (i > 21 && i < count) {
                    countHtml += `
                        <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                } else if (i !== 1 && i !== count) {
                    countHtml += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }
                if (i === count) {
                    if(count > 21) {
                        countHtml += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                    }
                    if (count !== 1) {
                        countHtml += `
                            <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                        `
                    }
                }
            }
            pgContatiner.innerHTML = countHtml;
            pageFunctions();
        } else {
            pagination.classList.add('d-none');
        }
    });
}

qNameInput.addEventListener("keyup", () => {
    renderPage();
});

const exportToExcel = () => {
    getSearchData();
    const method = "post";
    let params = {
        qName
    }
    let form = document.createElement('form');
    form.setAttribute("method", method);
    form.setAttribute("action", "/api/position/export-to-excel");
 
    for (let key in params) {
       if (params.hasOwnProperty(key)) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute('type', 'hidden');
          hiddenField.setAttribute('name', key);
          hiddenField.setAttribute('value', params[key]);
          form.appendChild(hiddenField);
       }
    }
    document.body.appendChild(form);
    form.submit();
 }
 
 exportToExcelBtn.addEventListener("click", () => {
    exportToExcel();
 });

setTimeout(renderPage, 1000);