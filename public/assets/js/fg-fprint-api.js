const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");

const pageFunctions = () => {
    const fPrintEntranceBtnS = document.querySelectorAll(".fPrintEntrance");
    const fPrintExitBtnS = document.querySelectorAll(".fPrintExit");
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
                $.get(`http://localhost:3000/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&entrance=true&time=${inputValue}`);
                addTimeModal.classList.remove('d-flex');
                addTimeModal.classList.add('d-none');
                loading.classList.add('d-flex');
                loading.classList.remove('d-none');
                setTimeout(renderPage, 2000);
            });
        });
    });
    fPrintExitBtnS.forEach(item => {
        item.addEventListener("click", () => {
            addTimeModal.classList.remove('d-none');
            addTimeModal.classList.add('d-flex');
            timeInputSubmit.value = item.value;

            timeInputSubmit.addEventListener("click", () => {
                const btnValue = timeInputSubmit.value;
                const inputValue = timeInput.value;
                $.get(`http://localhost:3000/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&exit=true&time=${inputValue}`);
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

}

function renderPage() {
    $.get("http://localhost:3000/api/fprints/inappropriate-fprints", (res) => {
        const result = res.result;
        let html = "";
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