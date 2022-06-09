const loading = document.querySelector(".loading");
const submitBtn = document.querySelector("#submitBtn");
const oldPassword = document.querySelector("#oldPassword");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");

const renderPage = () => {
    submitBtn.addEventListener("click", () => {
        loading.classList.remove("d-none");
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/profile/change-password",
            data: {
                oldPassword: oldPassword.value,
                password: password.value,
                confirmPassword: confirmPassword.value
            },
            success: (res) => {
                console.log(res);
                loading.classList.add("d-none");
                window.location.href = "/logout";
            }
        }).catch((err) => {
            console.log(err);
            loading.classList.add("d-none");
        });
    });
    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);