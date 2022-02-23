const tbody = document.querySelector("tbody");

const renderPage = () => {
    $.get("http://localhost:3000/api/time-off", (res) => {
        if(res.timeOffs.length < 1) {
            console.log(tbody);
            tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
        }
    })
}
renderPage();