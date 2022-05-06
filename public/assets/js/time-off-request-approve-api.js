const tbody = document.querySelector("tbody");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}
const renderPage = () => {
    $.get("http://localhost:3000/api/time-off?hr_approve=true&offset=0", (res) => {
        console.log(res);
        const timeOffs = res.result.timeoffs;
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
    });
}

renderPage();