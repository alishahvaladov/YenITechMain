const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");
const pgContatiner = document.querySelector(".pagination-container");


const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    console.log(pgItems);
    pgItems.forEach(item => {
        item.addEventListener("click", () => {
            loading.classList.remove('d-none');
            let offset = parseInt(item.value) - 1;
            let activeClass = document.querySelector('.active');
            let index = pgItems.indexOf(activeClass);
            pgItems[index].classList.remove('active');
            item.classList.add('active');
            activeClass = document.querySelector('.active');
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
                $.get(`http://localhost:3000/api/project/allProjects/${offset}`, (res) => {
                    let tbody = document.querySelector("tbody");
                    let html = "";
                    const projects = res.project;
                    projects.forEach(project => {
                        html += `
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>${project.name}</td>
                                <td>${project.address}</td>
                                <td>${project.first_name} ${project.last_name} ${project.father_name}</td>
                                <td class="d-flex justify-content-between">
                                    <a class="btn btn-outline-danger btn-sm" href="/projects/delete/${project.id}"><i class="bi bi-x-circle"></i></a>
                                    <a class="btn btn-outline-secondary btn-sm" href="/projects/update/${project.id}"><i class="bi bi-pencil-square"></i></a>
                                    <a class="btn btn-outline-primary btn-sm" href="/projects/project/${project.id}"><i class="bi bi-diagram-3"></i></a>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
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
    $.get("http://localhost:3000/api/project/allProjects/0", (res) => {
        console.log(res);
        const projects = res.project;
        let count = res.count[0].count;
        count = Math.ceil(count / 15);
        projects.forEach(project => {
            html += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${project.name}</td>
                    <td>${project.address}</td>
                    <td>${project.first_name} ${project.last_name} ${project.father_name}</td>
                    <td class="d-flex justify-content-between">
                        <a class="btn btn-outline-danger btn-sm" href="/projects/delete/${project.id}"><i class="bi bi-x-circle"></i></a>
                        <a class="btn btn-outline-secondary btn-sm" href="/projects/update/${project.id}"><i class="bi bi-pencil-square"></i></a>
                        <a class="btn btn-outline-primary btn-sm" href="/projects/project/${project.id}"><i class="bi bi-diagram-3"></i></a>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `
        });
        tbody.innerHTML = html;
        loading.classList.add('d-none');

        let countHtml = "";

        for (let i = 1; i <= count; i++) {
            if (i === 1) {
                countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
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
    });
}

setTimeout(renderPage, 1000);