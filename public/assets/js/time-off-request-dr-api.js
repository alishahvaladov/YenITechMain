const tbody = document.querySelector("tbody");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}
const renderPage = () => {
    $.get("http://localhost:3000/api/time-off/for-director", (res) => {
        console.log(res);
        const timeOffs = res.timeOffs;
        if(res.timeOffs.length < 1) {
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
        }
        
    })
}
renderPage();