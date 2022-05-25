const loading = document.querySelector('.loading');
const tbody = document.querySelector('tbody');
const pagination = document.querySelector('.pagination');
const pgContainer = document.querySelector('.pagination-container');


const renderPage = () => {
    $.get('http://localhost:3000/api/profile/my-time-off-requests?limit=15&offset=0', (res) => {
        console.log(res);
        const myTimeOffs = res.myTimeOffs;
        let count = res.myTimeOffsCount;
        count = Math.ceil(parseInt(count) / 15);
        let html = "";
        myTimeOffs.forEach(timeOff => {
            let timeOffType, status;
            if (timeOff.timeoff_type === 1) {
                timeOffType = "Öz hesabına məzuniyyət";
            } else if (timeOff.timeoff_type === 2) {
                timeOffType = "Əmək məzuniyyəti";
            } else if (timeOff.timeoff_type === 3) {
                timeOffType = "Sağlamlıq Məzuniyyəti";
            } else if (timeOff.timeoff_type === 4) {
                timeOffType = "Saatlıq icazə";
            }

            if (timeOff.status === 0) {
                status = `<span class="badge bg-secondary">Sənəd əksikdir</span>`
            } else if (timeOff.status === 1) {
                status = `<span class="badge bg-warning">Emaldadır(HR)</span>`
            } else if (timeOff.status === 2) {
                status = `<span class="badge bg-primary">Emaldadır(Şöbə Rəhbəri)</span>`
            } else if (timeOff.status === 3) {
                status = `<span class="badge bg-info">Əmr təsdiqi gözləyir</span>`
            } else if (timeOff.status === 4) {
                status = `<span class="badge bg-success">Təsdiqləndi</span>`
            } else if (timeOff.status === 4) {
                status = `<span class="badge bg-danger">Ləğv edildi</span>`
            }

            html += `
                <tr>
                    <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                    <td>${timeOffType}</td>
                    <td>${timeOff.timeoff_start_date}</td>
                    <td>${timeOff.timeoff_end_date}</td>
                    <td>${timeOff.timeoff_job_start_date}</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    });

    loading.classList.add('d-none');
}

setTimeout(renderPage, 1000);