const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");
const pgContainer = document.querySelector(".pagination-container");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
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
                $.get(`http://localhost:3000/api/time-off/for-director?offset=${offset}`,(res) => {
                    let up = "";
                    let html = "";
                    const timeOffs = res.result.timeoffs;
                    console.log(timeOffs);
                    if(timeOffs.length < 1) {
                        tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
                    } else {
                        timeOffs.forEach(timeOff => {
                            if (timeOff.timeoff_type !== 4) {
                                let status;
                                if(timeOff.timeoff_type === 2) {
                                    timeOff.timeoff_type = "Əmək məzuniyyəti"
                                } else if (timeOff.timeoff_type === 1) {
                                    timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                                } else if (timeOff.timeoff_type === 3) {
                                    timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                                }
                                if(timeOff.status === 0) {
                                    status = `
                                    <td class="bg-secondary"><button class="btn text-light shadow-none" style="cursor: inherit">Sənəd Əksikdir</button></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 1){
                                    status = `<td class="bg-warning"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(HR Təsdiq)</button></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 2) {
                                    status = `<td class="bg-primary"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(Şöbə Rəhbəri Təsdiq)</button></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 3) {
                                    status = `
                                    <td class="bg-info  p-1 border border-info rounded-3"><button class="btn text-light shadow-none" style="cursor: inherit">Əmr təsdiqi gözləyir</button></td>
                                    <td class=""><button value="${timeOff.id}" class="bg-primary text-light p-1 border border-info rounded-3 download-letter"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                                    `
                                } else if (timeOff.status === 4) {
                                    status = `
                                        <td class="bg-success"><button class="btn text-light shadow-none" style="cursor: inherit">Təsdiqləndi</button></td>
                                        <td></td>
                                    `
                                } else if (timeOff.status === 7) {
                                    status = `<td class="bg-danger"><button class="btn text-light shadow-none" style="cursor: inherit">Ləğv Edildi</butt></td>
                                    <td></td>
                                    `
                                }
                                html += `
                                    <tr> 
                                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                                        <td>${timeOff.timeoff_type}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                                        ${status} 
                                        <td></td>
                                    </tr>
                                `
                            }
                        });
                        tbody.innerHTML = html;
                    }
                    tbody.innerHTML = html;
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    });
}

const renderPage = () => {
    $.get("http://localhost:3000/api/time-off/for-director?offset=0 ", (res) => {
        console.log(res);
        const timeOffs = res.result.timeoffs;
        let count = res.result.count[0].count;
        count = Math.ceil(count / 15);
        if(timeOffs.length < 1) {
            tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
        } else {
            let html = "";
            timeOffs.forEach(timeOff => {
                let status;
                if(timeOff.timeoff_type === 2) {
                    timeOff.timeoff_type = "Əmək məzuniyyəti"
                } else if (timeOff.timeoff_type === 1) {
                    timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                } else if (timeOff.timeoff_type === 3) {
                    timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                }
                if(timeOff.status === 0) {
                    status = `
                    <td class="bg-secondary"><button class="btn text-light shadow-none" style="cursor: inherit">Sənəd Əksikdir</button></td>
                    <td></td>
                    `
                } else if (timeOff.status === 1){
                    status = `<td class="bg-warning"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(HR Təsdiq)</button></td>
                    <td></td>
                    `
                } else if (timeOff.status === 2) {
                    status = `<td class="bg-primary"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(Şöbə Rəhbəri Təsdiq)</button></td>
                    <td></td>
                    `
                } else if (timeOff.status === 3) {
                    status = `
                    <td class="bg-info  p-1 border border-info rounded-3"><button class="btn text-light shadow-none" style="cursor: inherit">Əmr təsdiqi gözləyir</button></td>
                    <td class=""><button value="${timeOff.id}" class="bg-primary text-light p-1 border border-info rounded-3 download-letter"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                    `
                } else if (timeOff.status === 4) {
                    status = `
                        <td class="bg-success"><button class="btn text-light shadow-none" style="cursor: inherit">Təsdiqləndi</button></td>
                        <td></td>
                    `
                } else if (timeOff.status === 7) {
                    status = `<td class="bg-danger"><button class="btn text-light shadow-none" style="cursor: inherit">Ləğv Edildi</butt></td>
                    <td></td>
                    `
                }
                html += `
                    <tr> 
                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                        <td>${timeOff.timeoff_type}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                        ${status}
                        <td></td>
                        <td></td>
                    </tr>
                `
            });
            tbody.innerHTML = html;

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
            pgContainer.innerHTML = countHtml;
            loading.classList.add("d-none");
            pageFunctions();
        }
    })
}
setTimeout(renderPage, 1000);