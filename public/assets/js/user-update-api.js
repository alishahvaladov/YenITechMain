const roleSelect = document.querySelector("#role");
const employeeInput = document.querySelector("#employee");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const updateForm = document.querySelector(".update-form");
const updatePassword = document.querySelector("#updatePasswordBtn");
const updatePasswordModal = document.querySelector(".update-password-modal");
const passwordUpdateCancelBtn = document.querySelector("#passwordUpdateCancel");
const passwordUpdateSubmitBtn = document.querySelector("#passwordUpdateSubmit");
const passwordInput = document.querySelector("#password");
const retypePasswordInput = document.querySelector("#retypePassword");
const message = document.querySelector(".message");
const loading = document.querySelector(".loading");

const renderPage = () => {
    const splittedURL = window.location.href.split("/");
    const lastParam = splittedURL[splittedURL.length - 1];
    $.get(`http://localhost:3000/api/users/getUser/${lastParam}`, (res) => {
        const roles = res.roles;
        const result = res.result[0];
        let options = '';
        employeeInput.value = `${result.first_name} ${result.last_name} ${result.father_name}`;
        usernameInput.value = result.username;
        emailInput.value = result.email;
        updateForm.action = `/users/update/${result.id}`;
        for (const [key, value] of Object.entries(roles)) {
            if(parseInt(key) === result.role) {
                options += `
                    <option value="${key}" selected>${value}</option>
                `
            } else {
                options += `
                    <option value="${key}">${value}</option>
                `
            }
        }
        roleSelect.innerHTML = options;
        loading.classList.add("d-none");
    });
    updatePassword.addEventListener("click", () => {
        updatePasswordModal.classList.remove('d-none');
        updatePasswordModal.classList.add('d-flex');
    });
    passwordUpdateCancelBtn.addEventListener("click", () => {
        updatePasswordModal.classList.remove('d-flex');
        updatePasswordModal.classList.add('d-none');
    });
    passwordUpdateSubmitBtn.addEventListener("click", () => {
        const password = passwordInput.value;
        const retypePassword = retypePasswordInput.value;
        $.post(`http://localhost:3000/api/users/update-password/${lastParam}`, {
            password,
            retypePassword
        }, (res) => {
            console.log(res);
            updatePasswordModal.classList.remove('d-flex');
            updatePasswordModal.classList.add('d-none');
            message.classList.remove("d-none");
            if(res.success === true) {
                message.innerHTML = `
                    <div class="alert alert-success alert-dismissible" role="alert"> ${res.message} </div>
                `
            } else {
                message.innerHTML = `
                    <div class="alert alert-danger alert-dismissible" role="alert"> ${res.message} </div>
                `
            }
            setTimeout(() => {
                message.classList.add("d-none");
            }, 1500);
        });
    });
}

setTimeout(renderPage, 1000);