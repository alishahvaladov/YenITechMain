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
                $.get(`http://localhost:3000/api/users/allUsers/${offset}`, (res) => {
                    let tbody = document.querySelector("tbody");
                    let html = "";
                    const users = res.users;
                    users.forEach(user => {
                        user.role = parseInt(user.role);
                        let roleTD = "";
                        if (user.role === 2) {
                            roleTD = `Admin`;
                        } else if (user.role === 3) {
                            roleTD = `Financier`;
                        } else if (user.role === 4) {
                            roleTD = `HR Assistance`;
                        } else if (user.role === 5) {
                            roleTD = `HR`;
                        } else if (user.role === 6) {
                            roleTD = `Audit Director`;
                        } else if (user.role === 7) {
                            roleTD = `Audit`;
                        } else if (user.role === 8) {
                            roleTD = `Management`;
                        } else if (user.role === 9) {
                            roleTD = `User`;
                        } else if (user.role === 10) {
                            roleTD = `Department Director`;
                        }
                        html += `
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>${user.first_name} ${user.last_name} ${user.father_name}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>
                                ${roleTD}
                            </td>
                            <td>
                                <a class="btn btn-outline-danger btn-sm" href="/delete/${user.id}"><i class="bi bi-x-circle"></i></a>
                                <a class="btn btn-outline-secondary btn-sm" href="/users/update/${user.id}"><i class="bi bi-pencil-square"></i></a>
                            </td>
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
    $.get("http://localhost:3000/api/users/allUsers/0", (res) => {
        console.log(res);
        const users = res.users;
        let count = res.count[0].count;
        count = Math.ceil(count / 15);
        users.forEach(user => {
            user.role = parseInt(user.role);
            let roleTD = "";
            if (user.role === 2) {
                roleTD = `Admin`;
            } else if (user.role === 3) {
                roleTD = `Financier`;
            } else if (user.role === 4) {
                roleTD = `HR Assistance`;
            } else if (user.role === 5) {
                roleTD = `HR`;
            } else if (user.role === 6) {
                roleTD = `Audit Director`;
            } else if (user.role === 7) {
                roleTD = `Audit`;
            } else if (user.role === 8) {
                roleTD = `Management`;
            } else if (user.role === 9) {
                roleTD = `User`;
            } else if (user.role === 10) {
                roleTD = `Department Director`;
            }
            html += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${user.first_name} ${user.last_name} ${user.father_name}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        ${roleTD}
                    </td>
                    <td>
                        <a class="btn btn-outline-danger btn-sm" href="/delete/${user.id}"><i class="bi bi-x-circle"></i></a>
                        <a class="btn btn-outline-secondary btn-sm" href="/users/update/${user.id}"><i class="bi bi-pencil-square"></i></a>
                    </td>
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