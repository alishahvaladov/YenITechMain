const tbody = document.querySelector("tbody");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}
const renderPage = () => {
    $.get("http://localhost:3000/api/time-off/for-director", (res) => {
        console.log(res);
        const timeOffs = res.timeOffs;
        let html = "";
        if(res.timeOffs.length < 1) {
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
                }
                if(timeOff.status === 0) {
                    status = `<td class=""><span class="bg-secondary text-light p-1 border border-secondary rounded-3">Sənəd Əksikdir</span></td>`
                } else if (timeOff.status === 1){
                    status = `<td class=""><span class="bg-warning text-light p-1 border border-warning rounded-3">Emaldadır(HR Təsdiq)</span></td>`
                } else if (timeOff.status === 2) {
                    status = `<td class=""><span class="bg-primary text-light p-1 border border-primary rounded-3">Emaldadır(Şöbə Rəhbəri Təsdiq)</span></td>`
                } else if (timeOff.status === 3) {
                    status = `<td class=""><span class="bg-success text-light p-1 border border-success rounded-3">Təsdiqləndi</span></td>`
                } else if (timeOff.status === 7) {
                    status = `<td class=""><span class="bg-danger text-light p-1 border border-danger rounded-3">Ləğv Edildi</span></td>`
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