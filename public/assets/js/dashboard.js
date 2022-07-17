const loading = document.querySelector('.loading');
const empCount = document.querySelector(".empCount");
const empCardDiv = document.querySelector(".emp-card");
const salarySum = document.querySelector("#salarySum");
const salarySumDiv = document.querySelector(".salary-sum");
const inapFprints = document.querySelector(".inap-fprints");
const inapFprintsCount = document.querySelector(".inap-fprints-count");
const newEmp = document.querySelector(".new-emp");
const newEmpCount = document.querySelector(".new-emp-count");
const lastNotTbody = document.querySelector(".lastNotTbody");
const salaryDeptTbody = document.querySelector(".salaryDeptTbody");
const latestTimeOffDiv = document.querySelector(".latest-timeoffs")
const latestTimeOffTbody = document.querySelector(".latest-timeoffs-tbody")

const months = [
    "Yan",
    "Fev",
    "Mart",
    "Apr",
    "May",
    "İyun",
    "İyul",
    "Avq",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
]


document.addEventListener("DOMContentLoaded", function () {
    var date = new
        Date(Date.now()); var defaultDate =
            date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" +
            date.getUTCDate();
    document.getElementById("datetimepicker-dashboard").flatpickr({
        inline:
            true, prevArrow: "<span title=\"Previous month\">&laquo;</span>",
        nextArrow: "<span title=\"Next month\">&raquo;</span>", defaultDate:
            defaultDate
    });
});


const monthlyGivenSalaryChart = async (labels, data) => {
    new Chart(document.getElementById("chartjs-dashboard-bar"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "This year",
                backgroundColor: window.theme.primary, borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary, hoverBorderColor:
                window.theme.primary,
                data: data,
                barPercentage: .75,
                categoryPercentage: .5
            }]
        }, options: {
            maintainAspectRatio: false, legend: { display: false }, scales: {
                yAxes:
                    [{
                        gridLines: { display: false }, stacked: true, ticks: { stepSize: 2500 }
                    }], xAxes: [{ stacked: false, gridLines: { color: "transparent" } }]
            }
        }
    });
}



const renderPage = () => {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/employee-count",
        success: ((result) => {
            empCardDiv.classList.remove("d-none");
            const count = result.result[0].count;
            empCount.innerHTML = count;
        })
    }).catch((err) => {
        window.location.href = "/employee"
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/last-month-salary",
        success: ((result) => {
            salarySumDiv.classList.remove("d-none");
            const sumSalary = result.result[0].salarySum;
            if (sumSalary) {
                salarySum.innerHTML = sumSalary;
            } else {
                salarySum.innerHTML = 0;
            }
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/inappropriate-fprints",
        success: ((result) => {
            inapFprints.classList.remove("d-none");
            inapFprintsCount.innerHTML = result.result[0].count;
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/last-employees",
        success: ((result) => {
            newEmp.classList.remove("d-none");
            newEmpCount.innerHTML = result.result[0].count;
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/last-notifications",
        success: ((result) => {
            const notifications = result.result;
            let tbodyHtml = "";
            notifications.forEach(notification => {
                tbodyHtml += `
                    <tr>
                        <td>${notification.header}</td>
                        <td>${notification.description}</td>
                        <td>
                            <a class="btn btn-outline-primary" href="${notification.url}">
                                <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });
            lastNotTbody.innerHTML = tbodyHtml;
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/salary-sum-by-department",
        success: ((result) => {
            const label = [];
            const data = [];

            const salaries = result.result;
            let tbodyHtml = "";

            salaries.forEach(salary => {
                label.push(salary.name);
                const totalSalary = salary.gross + salary.upay;
                data.push(parseFloat(totalSalary).toFixed(2))
                tbodyHtml += `
                    <tr>
                        <td>${salary.name}</td>
                        <td class="text-end">${parseFloat(totalSalary).toFixed(2)}</td>
                    </tr>
                `
            });

            salaryDeptTbody.innerHTML = tbodyHtml;
            
            new Chart(document.getElementById("chartjs-dashboard-pie"), {
                type: "pie",
                data: {
                    labels: label, datasets: [{
                        data, backgroundColor: [window.theme.primary,
                            window.theme.warning, window.theme.danger, window.theme.success, window.theme.info], borderWidth: 5
                    }]
                }, options:
                {
                    responsive: !window.MSInputMethodContext, maintainAspectRatio: false,
                    legend: { display: false }, cutoutPercentage: 75
                }
            });
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/last-timeoffs",
        success: ((result) => {
            const timeoffs = result.result;
            latestTimeOffDiv.classList.remove("d-none");
            let latestTimeOffHtml = "";
            let status = "";
            timeoffs.forEach(timeOff => {
                let status;
                if(timeOff.timeoff_type === 2) {
                    timeOff.timeoff_type = "Əmək məzuniyyəti"
                } else if (timeOff.timeoff_type === 1) {
                    timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                } else if (timeOff.timeoff_type === 3) {
                    timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                } else if (timeOff.timeoff_type === 4) {
                    timeOff.timeoff_type = "Saatlıq İcazə"
                }
                if(timeOff.status === 0) {
                    status = `
                    <td><span class="badge bg-secondary" style="cursor: inherit">Sənəd Əksikdir</span></td>
                    `
                } else if (timeOff.status === 1){
                    status = `<td><span class="badge bg-warning">Emaldadır(HR)</span></td>
                    `
                } else if (timeOff.status === 2) {
                    status = `<td><span class="badge bg-primary">Emaldadır(Şöbə Rəhbəri)</span></td>
                    `
                } else if (timeOff.status === 3) {
                    status = `
                    <td><span class="badge bg-info">Əmr təsdiqi gözləyir</span></td>
                    `
                } else if (timeOff.status === 4) {
                    status = `
                        <td><span class="badge bg-success">Təsdiqləndi</span></td>
                    `
                } else if (timeOff.status === 7) {
                    status = `<td><span class="badge bg-danger">Ləğv Edildi</butt></td>
                    `
                }
                latestTimeOffHtml += `
                    <tr>
                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                        <td class="d-none d-xl-table-cell">${timeOff.timeoff_start_date}</td>
                        <td class="d-none d-xl-table-cell">${timeOff.timeoff_end_date}</td>
                        ${status}
                        <td class="d-none d-md-table-cell">${timeOff.timeoff_type}</td>
                    </tr>
                `;
            });
            latestTimeOffTbody.innerHTML = latestTimeOffHtml;
        })
    }).catch((err) => {
        console.log(err);
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/dashboard/given-salaries",
        success: (async (result) => {

            const salariesByMonths = result.result;

            const labels = [];
            const data = []

            salariesByMonths.forEach(salary => {
                const month = months[parseInt(salary.months) - 1];
                labels.push(month);
                data.push(salary.cost);
            });

            await monthlyGivenSalaryChart(labels, data);

            
        })
    }).catch((err) => {
        console.log(err);
    })

    loading.classList.add('d-none');
}

renderPage();

// setTimeout(renderPage, 1000)