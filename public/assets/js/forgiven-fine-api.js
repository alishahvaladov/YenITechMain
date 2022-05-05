const pgContatiner = document.querySelector(".pagination-container");
const loading = document.querySelector(".loading");

const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
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
                $.get('http://localhost:3000/api/fprints/by-page', (res) => {
                    let tbody = $("tbody");
                    let trs = "";
                    tbody.text("");
                    let fprints = res.fPrints.fprints;
                    console.log(fprints);
                    for (let i = 0; i < fprints.length; i++) {
                        const date = new Date(fprints[i].f_print_date);
                        let time = [];
                        if(fprints[i].f_print_time) {
                            time = fprints[i].f_print_time.split(':');
                            time = time[0] + ":" + time[1];
                        }
                        let createdAt = date.toLocaleDateString();
                        createdAt = createdAt.split('/');
                        let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                        trs +=
                            `
                <tr>
                    <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                    <td>${fprints[i].projName}</td>
                    <td>${fprints[i].deptName}</td>
                    <td>${fprints[i].posName}</td>
                    <td>${time}</td>
                    <td>${updatedDate}</td>
                    <td></td>
                </tr>
            `
                    }
                    if(trs.length !== 0) {
                        tbody.html(trs);
                    } else {
                        tbody.text("No Data Found");
                    }
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    }); 
}

const renderPage = () => {
    $.get("http://localhost:3000/api/fine/forgiven-fine/0", (res) => {
            let forgivenFines = res.result.forgiven_fines;
            console.log(forgivenFines);
            let count = res.result.forgiven_fines_count[0].count;
            let forgivenUser = res.result.forgiven_user[0];
            let html = '';
            count = Math.ceil(count / 15);

            for (let i = 1; i <= count; i++) {
                if (i === 1) {
                    html += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                    html += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                } 
                
                if (i > 21 && i < count) {
                    html += `
                        <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                } else if (i !== 1 && i !== count) {
                    html += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }

                if (i === count) {
                    if(count > 21) {
                        html += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                    } if (i !== 1) {
                        html += `
                            <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                        `
                    }
                }
            }
            pgContatiner.innerHTML = html;
            let tbody = $("tbody");
            let trs = "";
            tbody.text("");
            for (let i = 0; i < forgivenFines.length; i++) {
                trs +=
                    `
                <tr>
                    <td>${forgivenFines[i].first_name} ${forgivenFines[i].last_name} ${forgivenFines[i].father_name}</td>
                    <td>${forgivenUser.first_name} ${forgivenUser.last_name} ${forgivenUser.father_name}</td>
                    <td>${forgivenFines[i].minute_total}</td>
                    <td>${forgivenFines[i].forgiven_minute}</td>
                    <td></td>
                </tr>
            `
            }
            if(trs.length !== 0) {
                tbody.html(trs);
            } else {
                tbody.text("No Data Found");
            }
            loading.classList.add('d-none');
            // pageFunctions();
        });
}

setTimeout(renderPage, 1000);