const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const approveModalCancel = document.querySelector("#approveModalCancel");
const approveModalApprove = document.querySelector("#approveModalApprove");
const approveModalInput = document.querySelector("#approve-modal-input");
const approveModal = document.querySelector(".approve-modal")
const warningModalCancel = document.querySelector("#warningModalCancel");
const warningModalApprove = document.querySelector("#warningModalApprove");
const warningModal = document.querySelector(".warning-modal");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");


const pageBtnActions = () => {
    const approveFineBtnS = document.querySelectorAll(".approve-fine");
    const deleteFineBtnS = document.querySelectorAll(".delete-fine");
    const resetFineBtnS = document.querySelectorAll(".reset-fine");
    const resetApprovedFineBtns = document.querySelectorAll(".reset-approved-fine");

    if (resetApprovedFineBtns.length > 0) {
        resetApprovedFineBtns.forEach(resetApprovedBtn => {
            resetApprovedBtn.addEventListener("click", () => {
                loading.classList.remove("d-none");
                const id = resetApprovedBtn.value;
                $.get(`http://localhost:3000/api/fine/reset-approved-fine/${id}`, (res) => {
                    setTimeout(renderPage, 1500);
                });
            });
        });
    }

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
}

const pageFuncs = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
    pgItems.forEach(item => {
       item.addEventListener("click", () => {
          loading.classList.remove('d-none');
          let offset = item.value;
          let activeClass = document.querySelector('.pagination-active');
          let index = pgItems.indexOf(activeClass);
          pgItems[index].classList.remove('pagination-active');
          item.classList.add('pagination-active');
          activeClass = document.querySelector('.pagination-active');
          index = pgItems.indexOf(activeClass);
          if(pgItems.length > 14) {
             if(index > 9 && index < pgItems.length - 10) {
                fTDots.classList.remove('d-none');
                lTDots.classList.remove('d-none');
                for(let i = 1; i < pgItems.length - 1; i++) {
                   pgItems[i].classList.add('d-none');
                }
                for (let i = index; i > index - 9; i--) {
                   if (i < 1) {
                      break;
                   }
                   pgItems[i].classList.remove('d-none')
                }
                for (let i = index; i < index + 9; i++) {
                   pgItems[i].classList.remove('d-none');
                }
             } else if (index <= 9) {
                fTDots.classList.add('d-none');
                lTDots.classList.remove('d-none');
                for (let i = 21; i < pgItems.length - 2; i++) {
                   pgItems[i].classList.add('d-none')
                }
                for (let i = 1; i < 21; i++) {
                   pgItems[i].classList.remove('d-none');
                }
             } else {
                lTDots.classList.add('d-none');
                fTDots.classList.remove('d-none');
                for (let i = 1; i < pgItems.length - 20; i++) {
                   pgItems[i].classList.add('d-none');
                }
                for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                   pgItems[i].classList.remove('d-none');
                }
             }
          }
          setTimeout(() => {
             $.get(`http://localhost:3000/api/fine?limit=15&offset=${offset}`, (res) => {
                let tbody = $("tbody");
                let trs = ``;
                tbody.text("");
                let fineData = res.fineData;
                fineData.forEach(fine => {
                    let date = new Date(fine.updatedAt);
                    date = date.toLocaleDateString();
                    const splitDate = date.toString().split("/");
                    date = `${splitDate[1]}.${splitDate[0]}.${splitDate[2]}`;
                    if (res.role === "admin") {
                        trs += `
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
                        trs += `
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
                                        <a class="btn btn-outline-info" href="/fines/cumilative/${fine.emp_id}"><i class="bi bi-arrow-return-right"></i></a>
                                    </div>
                                </td>
                            </tr>
                        `
                    }
                });
                if(trs.length !== 0) {
                   tbody.html(trs);
                } else {
                   tbody.text("No Data Found");
                }
                loading.classList.add('d-none');
                pageBtnActions();
             });
          }, 1000);
       });
    });
    pageBtnActions();
 }


const renderPage = () => {
    $.get("http://localhost:3000/api/fine?limit=15&offset=0", (res) => {
        let html = "";
        let count = res.fineCount[0].count;
        count = Math.ceil(parseInt(count) / 15);
        if (res.fineData.length > 0) {
            res.fineData.forEach(fine => {
                let date = new Date(fine.updatedAt);
                date = date.toLocaleDateString();
                const splitDate = date.toString().split("/");
                date = `${splitDate[1]}.${splitDate[0]}.${splitDate[2]}`;
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
                                    <a class="btn btn-outline-info" href="/fines/cumilative/${fine.emp_id}"><i class="bi bi-arrow-return-right"></i></a>
                                </div>
                            </td>
                        </tr>
                    `
                }
            });
            tbody.innerHTML = html;
            
            
            let pgHtml = "";
            if (count === 1) {
                pagination.classList.add('d-none');
             } else {
                for (let i = 1; i <= count; i++) {
                   if (i === 1) {
                      pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                      if(count > 21) {
                         pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                      } else {
                        pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots d-none disabled">...</button>`
                      }
                   } if (i > 21 && i < count) {
                      pgHtml += `
                           <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                   } else if (i !== 1 && i !== count) {
                      pgHtml += `
                           <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                   }
                   if (i === count) {
                      if (count > 21) {
                         pgHtml += `
                           <button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>
                         `
                      } else {
                        pgHtml += `
                            <button class="btn btn-outline-dark btn-sm lTDots d-none disabled">...</button>
                        `
                      }
                      if (count > 1) {
                         pgHtml += `
                           <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                       `
                      }
                      
                   }
                }
                pgContainer.innerHTML = pgHtml;
             }


            pageFuncs();
        } else {
            tbody.innerHTML = "No Data Found";
        }
        

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