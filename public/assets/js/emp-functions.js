const resInputs = document.querySelectorAll(".resignation-inputs");


resInputs.forEach(item => {
    item.addEventListener("change", () => {
        const parent = item.parentNode;
        let child = parent.childNodes[3];
        child.childNodes[3].classList.remove("d-none");
        child.childNodes[5].innerHTML = item.files[0].name;
    });
});