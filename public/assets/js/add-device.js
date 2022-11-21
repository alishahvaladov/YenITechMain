const loading = document.querySelector(".loading");
const inputAddBtn = document.querySelector("#inputAddBtn");
const deviceSpecsDiv = document.querySelector(".device-specs");
const submitBtn = document.querySelector("#submitBtn");
const deviceName = document.querySelector("#deviceName");

const renderPage = () => {
    loading.classList.add("d-none");
    inputAddBtn.addEventListener("click", () => {
        const inputDiv = document.createElement("div");
        inputDiv.classList.add("d-flex");
        inputDiv.classList.add("justify-content-between");
        inputDiv.classList.add("my-4");
        const input1 = document.createElement("input");
        input1.classList.add("form-control");
        input1.classList.add("key-item");
        input1.type = "text";
        const marginXDiv = document.createElement("div");
        marginXDiv.classList.add("mx-2");
        const input2 = document.createElement("input");
        input2.classList.add("form-control");
        input2.classList.add("value-item");
        input2.type = "text";
        inputDiv.append(input1);
        inputDiv.append(marginXDiv);
        inputDiv.append(input2);
        deviceSpecsDiv.append(inputDiv);
    });
}

submitBtn.addEventListener("click", () => {
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
        url: "/api/devices/add",
        type: "POST",
        data,
        success: (result => {
            console.log(result);
        })
    }).catch((err) => {
        console.log(err);
    });
});

renderPage();