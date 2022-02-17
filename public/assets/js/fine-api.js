const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const approveModalCancel = document.querySelector("#approveModalCancel");
const approveModalApprove = document.querySelector("#approveModalApprove");
const approveModalInput = document.querySelector("#approve-modal-input");
const approveModal = document.querySelector(".approve-modal")
const warningModalCancel = document.querySelector("#warningModalCancel");
const warningModalApprove = document.querySelector("#warningModalApprove");
const warningModal = document.querySelector(".warning-modal");

const renderPage = () => {
    console.log("salam");
    $.get("http://localhost:3000/api/fine", (res) => {
        let html = "";
        console.log(res);
        res.result.forEach(fine => {
            let date = new Date(fine.updatedAt);
            console.log(fine);
            date = date.toLocaleDateString();
            const splitDate = date.toString().split("/");
            date = `${splitDate[1]}.${splitDate[0]}.${splitDate[2]}`
            if(fine.minute_total - 30 < 0) {
                fine.minute_total = 0;
            } else {
                fine.minute_total -= 30
            }
            if (res.role === "admin") {
                html += `
                    <tr> 
                        <td>
                            ${fine.first_name} ${fine.last_name} ${fine.father_name}
                        </td>
                        <td>
                            ${fine.minute_total}
                        </td>
                        <td>
                            ${fine.fine_minute}
                        </td>
                        <td>
                            ${date}
                        </td>                  
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary reset-approved-fine" value="${fine.fineID}"><i class="bi bi-arrow-clockwise"></i></button>
                            </div>
                        </td>     
                    </tr>
                `
            } else {
                html += `
                    <tr> 
                        <td>
                            ${fine.first_name} ${fine.last_name} ${fine.father_name}
                        </td>
                        <td>
                            ${fine.minute_total}
                        </td>
                        <td>
                            ${fine.fine_minute}
                        </td>
                        <td>
                            ${date}
                        </td>                  
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-outline-success approve-fine" value="${fine.fineID}"><i class="bi bi-check-circle-fill"></i></button>
                                <button class="btn btn-outline-danger delete-fine" value="${fine.fineID}"><i class="bi bi-x-circle-fill"></i></button>
                                <button class="btn btn-outline-secondary reset-fine" value="${fine.fineID}"><i class="bi bi-pencil-square"></i></button>
                            </div>
                        </td>     
                    </tr>
                `
            }
        });
        tbody.innerHTML = html;
        const approveFineBtnS = document.querySelectorAll(".approve-fine");
        const deleteFineBtnS = document.querySelectorAll(".delete-fine");
        const resetFineBtnS = document.querySelectorAll(".reset-fine");


        approveFineBtnS.forEach(item => {
            item.addEventListener("click", () => {
                const btnValue = item.value;
                $.get(`http://localhost:3000/api/fine/approve-fine?btnValue=${btnValue}`);
                loading.classList.remove("d-none");
                loading.classList.add("d-flex");
                setTimeout(renderPage, 1500);
            });
        });

        resetFineBtnS.forEach(item => {
            item.addEventListener("click", () => {
                approveModal.classList.remove("d-none");
                approveModal.classList.add("d-flex");
                approveModalApprove.value = item.value;
            });
        });
        deleteFineBtnS.forEach(item => {
            item.addEventListener("click", () => {
                warningModal.classList.remove("d-none");
                warningModal.classList.add("d-flex");
                warningModalApprove.value = item.value;
            });
        });

        setTimeout(() => {
            loading.classList.add("d-none");
        }, 1000);
    });
}
const requests = () => {
    approveModalApprove.addEventListener("click", () => {
        let minute = approveModalInput.value;
        let btnValue = approveModalApprove.value;
        $.get(`http://localhost:3000/api/fine/approve-edited-fine?btnValue=${btnValue}&minute=${minute}`);
        loading.classList.remove("d-none");
        loading.classList.add("d-flex");
        approveModal.classList.remove("d-flex");
        approveModal.classList.add("d-none");
        setTimeout(renderPage, 1500);
    });
    warningModalApprove.addEventListener("click", (event) => {
        const btnValue = warningModalApprove.value;
        $.get(`http://localhost:3000/api/fine/reset-fine?btnValue=${btnValue}`);
        loading.classList.remove("d-none");
        loading.classList.add("d-flex");
        warningModal.classList.remove("d-flex");
        warningModal.classList.add("d-none");
        setTimeout(renderPage, 1500);
    });
}
renderPage();
requests();

approveModalCancel.addEventListener("click", () => {
    approveModal.classList.add("d-none");
});
warningModalCancel.addEventListener("click", () => {
    warningModal.classList.add("d-none");
});