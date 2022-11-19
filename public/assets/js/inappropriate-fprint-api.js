const renderInappropriateFPrints = () => {
    const tbody = document.querySelector("tbody");
    const loading = document.querySelector(".loading");
    const pgContatiner = document.querySelector(".pagination-container");

    const fPrintExitActions = () => {
        const fPrintExitBtnS = document.querySelectorAll(".fPrintExit");
        const addTimeModal = document.querySelector(".add-time-modal");
        fPrintExitBtnS.forEach(item => {
            item.addEventListener("click", () => {
                addTimeModal.classList.remove('d-none');
                addTimeModal.classList.add('d-flex');
                timeInputSubmit.value = item.value;

                timeInputSubmit.addEventListener("click", () => {
                    const btnValue = timeInputSubmit.value;
                    const inputValue = timeInput.value;
                    $.get(`/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&exit=true&time=${inputValue}`);
                    addTimeModal.classList.remove('d-flex');
                    addTimeModal.classList.add('d-none');
                    loading.classList.add('d-flex');
                    loading.classList.remove('d-none');
                    setTimeout(renderPage, 2000);
                });
            });
        });
    }

    const pageFunctions = () => {
        const fPrintEntranceBtnS = document.querySelectorAll(".fPrintEntrance");
        const addTimeModal = document.querySelector(".add-time-modal");
        const timeInputCancel = document.querySelector("#timeInputCancel");
        const timeInputSubmit = document.querySelector('#timeInputSubmit');
        const timeInput = document.querySelector("#timeInput");
        fPrintEntranceBtnS.forEach(item => {
            item.addEventListener("click", () => {
                addTimeModal.classList.remove('d-none');
                addTimeModal.classList.add('d-flex');
                timeInputSubmit.value = item.value;

                timeInputSubmit.addEventListener("click", () => {
                    const btnValue = timeInputSubmit.value;
                    const inputValue = timeInput.value;
                    $.get(`/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&entrance=true&time=${inputValue}`);
                    addTimeModal.classList.remove('d-flex');
                    addTimeModal.classList.add('d-none');
                    loading.classList.add('d-flex');
                    loading.classList.remove('d-none');
                    setTimeout(renderPage, 2000);
                });
            });
        });
        
        timeInputCancel.addEventListener('click', () => {
            addTimeModal.classList.remove('d-flex');
            addTimeModal.classList.add('d-none');
        });
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
                    $.get(`/api/fprints/inappropriate-fprints/${offset}`, (res) => {
                        let tbody = document.querySelector("tbody");
                        let html = "";
                        const result = res.result;
                        result.forEach(item => {
                            if(item.f_print_time_entrance === null) {
                                item.f_print_time_entrance = `<button class="btn btn-outline-success fPrintEntrance" value="${item.id}">Vaxt əlavə et</button>`;
                            } else if (item.f_print_time_exit === null) {
                                item.f_print_time_exit = `<button class="btn btn-outline-success fPrintExit" value="${item.id}">Vaxt əlavə et</button>`;
                            }
                            html += `
                            <tr> 
                                <td>${item.first_name} ${item.last_name} ${item.father_name}</td>
                                <td>${item.f_print_date}</td>
                                <td>${item.f_print_time_entrance}</td>
                                <td>${item.f_print_time_exit}</td>
                            </tr>
                        `
                        });
                        tbody.innerHTML = html;
                        loading.classList.remove("d-flex");
                        loading.classList.add("d-none");
                        setTimeout(() => {
                            fPrintExitActions();
                        }, 200);
                    });
                }, 1000);
            });
        });
        fPrintExitActions();
    }

    function renderPage() {
        $.get("/api/fprints/inappropriate-fprints/0", (res) => {
            const result = res.result;
            let html = "";
            let count = res.count[0].count;
            let countHtml = '';
            count = Math.ceil(count / 15);

            for (let i = 1; i <= count; i++) {
                if (i === 1) {
                    countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                    countHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                } if (i > 21 && i < count) {
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
                    countHtml += `
                <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
            `
                }
            }
            pgContatiner.innerHTML = countHtml;

            result.forEach(item => {
                if(item.f_print_time_entrance === null) {
                    item.f_print_time_entrance = `<button class="btn btn-outline-success fPrintEntrance" value="${item.id}">Vaxt əlavə et</button>`;
                } else if (item.f_print_time_exit === null) {
                    item.f_print_time_exit = `<button class="btn btn-outline-success fPrintExit" value="${item.id}">Vaxt əlavə et</button>`;
                }
                html += `
                <tr> 
                    <td>${item.first_name} ${item.last_name} ${item.father_name}</td>
                    <td>${item.f_print_date}</td>
                    <td>${item.f_print_time_entrance}</td>
                    <td>${item.f_print_time_exit}</td>
                </tr>
            `
            });
            tbody.innerHTML = html;
            loading.classList.remove("d-flex");
            loading.classList.add("d-none");
            pageFunctions();
        });
    }


    setTimeout(renderPage, 1500);
}


renderInappropriateFPrints();