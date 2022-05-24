const workingHoursRow = document.querySelector(".working-hours-row");
const loading = document.querySelector(".loading");
const saveBtn = document.querySelector("#saveBtn");

const hideLoading = () => {
    loading.classList.add("d-none");
}



const renderPage = () => {
    $.get('http://localhost:3000/api/working-hours', (res) => {
        const types = res.types;
        let html = "";
        types.forEach(type => {
            let inpIDShiftStart = "";
            let inpIDShiftEnd = "";
            if (type.name === "Tam ştat") {
                inpIDShiftStart = "fullTimeForShiftStart";
                inpIDShiftEnd = "fullTimeForShiftEnd";
            } else if (type.name === "Yarımştat(Günün birinci yarısı)") {
                inpIDShiftStart = "firstPartTimeForShiftStart";
                inpIDShiftEnd = "firstPartTimeForShiftEnd";
            } else {
                inpIDShiftStart = "secondPartTimeForShiftStart";
                inpIDShiftEnd = "secondPartTimeForShiftEnd";
            }
            html += `
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">${type.name}</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-lg-6">
                                    <label class="form-label" for="">İşə gəlmə</label>
                                    <input type="time" class="form-control" id="${inpIDShiftStart}" value="${type.shift_start}">
                                </div>
                                <div class="col-12 col-lg-6">
                                    <label class="form-label" for="">İşdən çıxma</label>
                                    <input type="time" class="form-control" id="${inpIDShiftEnd}" value="${type.shift_end}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        workingHoursRow.innerHTML = html;
        hideLoading();
        flatpickr("input[type='time']", {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true
        });
    });
}

saveBtn.addEventListener('click', () => {
    const fullTimeForShiftStart = document.querySelector("#fullTimeForShiftStart").value;
    const fullTimeForShiftEnd = document.querySelector("#fullTimeForShiftEnd").value;
    const firstPartTimeForShiftStart = document.querySelector("#firstPartTimeForShiftStart").value;
    const firstPartTimeForShiftEnd = document.querySelector("#firstPartTimeForShiftEnd").value;
    const secondPartTimeForShiftStart = document.querySelector("#secondPartTimeForShiftStart").value;
    const secondPartTimeForShiftEnd = document.querySelector("#secondPartTimeForShiftEnd").value;

    $.post('http://localhost:3000/api/working-hours/update', {
        shiftTypes: [
            {
                "name": "Tam ştat",
                "shift_start": fullTimeForShiftStart,
                "shift_end": fullTimeForShiftEnd
            },
            {
                "name": "Yarımştat(Günün birinci yarısı)",
                "shift_start": firstPartTimeForShiftStart,
                "shift_end": firstPartTimeForShiftEnd
            },
            {
                "name": "Yarımştat(Günün ikinci yarısı)",
                "shift_start": secondPartTimeForShiftStart,
                "shift_end": secondPartTimeForShiftEnd
            }
        ]
    }, (res) => {
        console.log(res);
        loading.classList.remove('d-none');
        if (res.success === true) {
            setTimeout(renderPage, 1000);
        } else {
            setTimeout(() => {
                renderPage();
                alert(res.message);
            }, 1000);
        }
    });
});

setTimeout(renderPage, 1000);