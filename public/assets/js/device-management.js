const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const specsEditContainer = document.querySelector(".specs-edit-container");
const modal = document.querySelector(".device-edit-modal");
const header = document.querySelector(".device-name-header");
const cancelBtn = document.querySelector("#cancelBtn");
const submitEditBtn = document.querySelector("#submitEditBtn");
const deviceName = document.querySelector("#deviceName");

const renderPage = () => {
    $.get("/api/devices?offset=0", (res) => {
        const devices = res.devices;
        let tbodyHTML = "";
        let specHTML;
        devices.forEach(device => {
            let specHTML = "<ul>";
            const jsonString = JSON.parse(device.json_string);
            for (const [key, value] of Object.entries(jsonString.specs)) {
                specHTML += `
                    <li><span class="exo2-bold">${key}</span>:<span class="mx-2">${value}</span></li>
                `;
            }
            tbodyHTML += `
                <tr>
                    <td>${jsonString.name}</td>
                    <td>${specHTML}</td>
                    <td>
                        <button class="btn btn-secondary edit-btn" value=${device.id}>Edit</button>
                    </td>
                </tr>
            `;
            // console.log(jsonString);
            tbody.innerHTML = tbodyHTML;
            specHTML += "</ul>";
        });
        const editButtons = document.querySelectorAll(".edit-btn");

        editButtons.forEach(editBtn => {
            editBtn.addEventListener("click", () => {
                submitEditBtn.value = editBtn.value;
                $.get(`/api/devices/by-id?id=${editBtn.value}`, (res) => {
                    const deviceJSON = JSON.parse(res.device[0].json_string).specs;
                    deviceName.value = JSON.parse(res.device[0].json_string).name;
                    let deviceHTML = "";
                    
                    for (const [key, value] of Object.entries(deviceJSON)) {
                        deviceHTML += `
                            <div class="d-flex justify-content-between my-4">
                                <input class="form-control key-item" type="text" value="${key}">
                                <div class="mx-2"></div>
                                <input class="form-control value-item" type="text" value="${value}">
                            </div>
                        `;
                    }
                    specsEditContainer.innerHTML = deviceHTML;
                    modal.classList.remove("d-none");
                });
            });
        });

        cancelBtn.addEventListener("click", () => {
            specsEditContainer.innerHTML = "";
            modal.classList.add("d-none");
            submitEditBtn.value = "";
        });

        loading.classList.add("d-none");
    })
}

submitEditBtn.addEventListener("click", () => {
    const keyItems = document.querySelectorAll(".key-item");
    const valueItems = document.querySelectorAll(".value-item");
    const data = {};
    data.name = deviceName.value;
    const specs = {};
    for (let i = 0; i < keyItems.length; i++) {
        specs[keyItems[i].value] = valueItems[i].value;
    }
    data.specs = specs;
    console.log(data);
    $.ajax({
        url: `/api/devices/update?id=${submitEditBtn.value}`,
        type: "POST",
        data,
        success: (result => {
            loading.classList.remove("d-none");
            specsEditContainer.innerHTML = "";
            modal.classList.add("d-none");
            submitEditBtn.value = "";
            setTimeout(() => {
                renderPage();
            }, 500);
        })
    }).catch((err) => {
        console.log(err);
    });
});

renderPage();