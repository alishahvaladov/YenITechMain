const leftContainer = document.querySelector(".toff-select-cont-left");
const rightContainer = document.querySelector(".toff-select-cont-right");
const loading = document.querySelector(".loading");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}
const renderPage = () => {
    let id = document.querySelector("#id");
    id = id.value;
    $.get(`/api/time-off/approve-requests/hr/${id}`, (res) => {
        const filename = res.fileName;
        console.log(filename)
        const result = res.result[0];
        let dOffSD = result.timeoff_start_date;
        dOffSD = dateToAzVersion(dOffSD);
        let dOffED = result.timeoff_end_date;
        dOffED = dateToAzVersion(dOffED);
        let wStartD = result.timeoff_job_start_date;
        wStartD = dateToAzVersion(wStartD);
        let dOffType;
        if(result.timeoff_type === 1) {
            dOffType = "Öz hesabına məzuniyyət";
        } else if (result.timeoff_type === 2) {
            dOffType = "Əmək məzuniyyəti";
        } else if (result.timeoff_type === 3) {
            dOffType = "Sağlamlıq məzuniyyəti";
        } else if (result.timeoff_type === 4) {
            dOffType = "Saatlıq icazə";
        }
        let leftContHtml = `
            <div class="toff-branch d-flex justify-content-between">
                <label>Əməkdaş </label>
                <input type="text" value="${result.first_name} ${result.last_name} ${result.father_name}" disabled>
            </div>
            <div class="toff-branch d-flex justify-content-between">
                <label>Məzuniyyətin tipi </label>
                <input type="text" value="${dOffType}" disabled>
            </div>
            <div class="toff-branch d-flex justify-content-between">
                <label>Başlama Tarixi </label>
                <input type="text" value="${dOffSD}" disabled>
            </div>
            <div class="toff-branch d-flex justify-content-between">
                <label>Bitmə Tarixi </label>
                <input type="text" value="${dOffED}" disabled>
            </div>
            <div class="toff-branch d-flex justify-content-between">
                <label>İşə qayıtma tarixi </label>
                <input type="text" value="${wStartD}" disabled>
            </div>
        `;
        let rightContHtml;
        let src;
        if (filename.includes("jpg") || filename.includes("jpeg") || filename.includes("png")) {
            
            rightContHtml = `
                <div>
                    <img src="/employee/files/time-off/form/${result.emp_id}-${result.first_name.toLocaleLowerCase()}-${result.last_name.toLocaleLowerCase()}-${result.father_name.toLocaleLowerCase()}/${filename}" style="width: 300px">
                </div>
            `
        }
        leftContainer.innerHTML = leftContHtml;
        rightContainer.innerHTML = rightContHtml;

        document.querySelector("#timeOffCancel").addEventListener("click", () => {
            $.get(`/api/time-off/cancel-requests/hr/${id}`, (res) => {
                console.log(res);
            });
        });
        document.querySelector("#timeOffApprove").addEventListener("click", () => {
            $.get(`/api/time-off/approve-request/hr/${id}`, (res) => {
                console.log(res);
            });
        });
    });
    loading.classList.add("d-none");
}


setTimeout(renderPage, 1000);