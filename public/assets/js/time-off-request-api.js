const tbody = document.querySelector("tbody");

const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}

const renderPage = () => {
    $.get("http://localhost:3000/api/time-off", (res) => {
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
                    status = `<td class=""><span class="bg-warning text-light p-1 border border-warning rounded-3">Təsdiq gözləyir</span></td>`
                } else {
                    status = `<td class=""><span class="bg-success text-light p-1 border border-success rounded-3">Təsdiqləndi</span></td>`
                }
                html += `
                    <tr> 
                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                        <td>${timeOff.timeoff_type}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                        <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                        ${status}
                        <td>
                            <button class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i></button>
                        </td>
                    </tr>
                `
            });
            tbody.innerHTML = html;
        }
        
    })
}
renderPage();