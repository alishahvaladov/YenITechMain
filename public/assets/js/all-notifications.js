const loading = document.querySelector(".loading");
const pagination = document.querySelector(".pagination");
const tbody = document.querySelector("tbody");

const renderPage = () => {
    $.get("http://localhost:3000/api/notification/all-notifications?limit=15&offset=0", (res) => {
        console.log(res);
        let count = res.count[0].count;
        count = Math.ceil(parseInt(count) / 15);
        const notifications = res.notifications;
        let html = "";

        notifications.forEach(notification => {
            let status = "";
            let importance = '';

            if (notification.seen === 0) {
                status = `<span class="badge bg-primary">Yeni</span>`;
            } else if (notification.seen === 1) {
                status =`<span class="badge bg-info">Oxunmadı</span>`;
            } else if (notification.seen === 2) {
                status =`<span class="badge bg-success">Oxundu</span>`;
            }


            if (notification.importance === 1) {
                importance = `<i class="bi bi-bell text-warning" style="font-size: 20px;"></i>`;
            } else {
                importance = `<i class="bi bi-exclamation-circle text-danger" style="font-size: 20px;"></i>`;
            }

            let createdAt = new Date(notification.createdAt);
            let date = createdAt.getDate().toString();
            let month = createdAt.getMonth().toString();
            let hour = createdAt.getHours().toString();
            let minute = createdAt.getMinutes().toString();
            const year = createdAt.getFullYear();
            if (date.length === 1) {
            date = `0${date}`;
            }
            if (month.length === 1) {
                month = `0${month}`;
            }
            if (hour.length === 1) {
            hour = `0${hour}`;
            }
            if (minute.length === 1) {
                minute = `0${minute}`;
            }
            const createdTime = `${date}.${month}.${year} ${hour}:${minute}`;

            html += `
                <tr>
                    <td>${notification.header}</td>
                    <td>${notification.description}</td>
                    <td>${status}</td>
                    <td>${importance}</td>
                    <td>${createdTime}</td>
                    <td>
                        <button class="btn btn-outline-primary notification-url" value="${notification.url}">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button
                    </td>
                </tr>
            `
        });
        tbody.innerHTML = html;

        if (count < 2) {
            pagination.classList.add("d-none");
        }
    });

    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);