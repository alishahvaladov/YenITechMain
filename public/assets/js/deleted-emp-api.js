const loading = document.querySelector(".loading");

const renderPage = () => {
    $.post(`http://localhost:3000/api/deleted-employees`, {
        
    }, (res) => {
        console.log(res);
    })

    loading.classList.add('d-none');
}


setTimeout(renderPage, 1000);