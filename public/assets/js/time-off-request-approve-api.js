const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}

const pageFuncs = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    pgItems.forEach(item => {
        item.addEventListener("click", () => {
            loading.classList.remove('d-none');
            let offset = item.value;
            let activeClass = document.querySelector('.pagination-active');
            let index = pgItems.indexOf(activeClass);
            pgItems[index].classList.remove('pagination-active');
            item.classList.add('pagination-active');
            activeClass = document.querySelector('.pagination-active');
            index = pgItems.indexOf(activeClass);
            if(pgItems.length > 14) {
                if(index > 9 && index < pgItems.length - 14) {
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
                $.get(`http://localhost:3000/api/time-off?hr_approve=true&offset=${offset}`, (res) => {
                    const timeOffs = res.result.timeoffs;
                    let count = res.result.count[0].count;
                    count = Math.ceil(parseInt(count) / 15);
                    let html = "";
                    if(timeOffs.length < 1) {
                        tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
                    } else {
                        timeOffs.forEach(timeOff => {
                            let status;
                            if(timeOff.timeoff_type === 2) {
                                timeOff.timeoff_type = "Əmək məzuniyyəti"
                            } else if (timeOff.timeoff_type === 1) {
                                timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                            } else if (timeOff.timeoff_type === 3) {
                                timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                            } else if (timeOff.timeoff_type === 4) {
                                timeOff.timeoff_type = "Saatlıq icazə"
                            }
                            let approveBtn = `<td><a class="btn btn-outline-secondary" href="http://localhost:3000/timeoffrequests/approve-requests/hr/${timeOff.id}"><i class="bi bi-arrow-right-circle-fill"></i></a></td>`
                            html += `
                                <tr> 
                                    <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                                    <td>${timeOff.timeoff_type}</td>
                                    <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                                    <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                                    <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                                    ${approveBtn}
                                </tr>
                            `
                        });
                        tbody.innerHTML = html;
                    }
                    loading.classList.add("d-none");
                });
            }, 1000);
        });
    });
}

const renderPage = () => {
    $.get("http://localhost:3000/api/time-off?hr_approve=true&offset=0", (res) => {
        console.log(res);
        const timeOffs = res.result.timeoffs;
        let count = res.result.count[0].count;
        count = Math.ceil(parseInt(count) / 15);
        let html = "";
        if(timeOffs.length < 1) {
            tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
        } else {
            timeOffs.forEach(timeOff => {
                let status;
                if(timeOff.timeoff_type === 2) {
                    timeOff.timeoff_type = "Əmək məzuniyyəti"
                } else if (timeOff.timeoff_type === 1) {
                    timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                } else if (timeOff.timeoff_type === 3) {
                    timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                } else if (timeOff.timeoff_type === 4) {
                    timeOff.timeoff_type = "Saatlıq icazə"
                }
                let approveBtn = `<td><a class="btn btn-outline-secondary" href="http://localhost:3000/timeoffrequests/approve-requests/hr/${timeOff.id}"><i class="bi bi-arrow-right-circle-fill"></i></a></td>`
                html += `
                    <tr> 
                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                        <td>${timeOff.timeoff_type}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                        ${approveBtn}
                    </tr>
                `
            });
            tbody.innerHTML = html;
            let pgHtml = "";
            if (count === 1) {
                pagination.classList.add('d-none');
                limit.classList.add('d-none');
             } else {
                for (let i = 1; i <= count; i++) {
                   if (i === 1) {
                      pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                      if(count > 21) {
                         pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                      }
                   } if (i > 21 && i < count) {
                      pgHtml += `
                           <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                   } else if (i !== 1 && i !== count) {
                      pgHtml += `
                           <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                   }
                   if (i === count) {
                      if (count > 21) {
                         pgHtml += `
                           <button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>
                         `
                      }
                      if (count > 1) {
                         pgHtml += `
                           <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                      }
                      
                   }
                }
                pgContainer.innerHTML = pgHtml;
             }
        }
        loading.classList.add("d-none");
        pageFuncs();
    });
}

setTimeout(renderPage, 1000);