const pgContainer = document.querySelector('.pagination-container');
const loading = document.querySelector(".loading");
const empEditModal = document.querySelector(".employee-full-data-modal");
const empModalCloseBtn = document.querySelector(".empModalCloseBtn");

const empName = document.querySelector("#name");
const empMName = document.querySelector("#midName");
const inpSurname = document.querySelector("#surname");
const fatherName = document.querySelector("#fatherName");
const inpSex = document.querySelector("#sex");
const inpDob = document.querySelector("#dob");
const qAddress = document.querySelector("#qAddress");
const yAddress = document.querySelector("#yAddress");
const inpSSN = document.querySelector("#SSN");
const inpFIN = document.querySelector("#FIN");
const pNumber = document.querySelector("#phoneNumber");
const hNumber = document.querySelector("#homeNumber");
const shiftStart = document.querySelector("#shiftStart");
const inpShiftEnd = document.querySelector("#shiftEnd");
const jStartDate = document.querySelector("#jStartDate");
const dayOffDays = document.querySelector("#dayOffDays");
const workingDays = document.querySelector("#workingDays");
const inpProject = document.querySelector("#project");
const inpDepartment = document.querySelector("#department");
const inpPosition = document.querySelector("#position");

const empRemModule = () => {
   let empRemoveBtn;
   let empCancelBtn;

   empRemoveBtn = $(".empRmBtn");
   empCancelBtn = $(".empModalCancelBtn")

   empCancelBtn.each(function () {
      $(this).on("click", () => {
         $(".modal-remove").removeClass("show-modal");
      });
   });

   empRemoveBtn.each(function (index) {
      console.log($(this).val());
      $(this).on("click", () => {
         $("body").css("cursor", "progress");
         const id = $(this).val();
         console.log(id);
         $.post("http://localhost:3000/api/employee-data", {
            emp_id: id
         }, (res) => {
            const form = $("#remove-form");
            const inpResult = res.result[0];
            console.log(inpResult);
            const eName = $("#empName");
            const eSName = $("#empSName");
            const eFName = $("#empFName");
            const ePNumb = $("#empPNumber");
            const eDept = $("#empDeptName");
            const ePos = $("#empPosName");
            const eProj = $("#empProjName");

            form.attr("action", "/employee/remove/" + id.toString())
            eName.val(inpResult.first_name);
            eSName.val(inpResult.last_name);
            eFName.val(inpResult.father_name);
            ePNumb.val(inpResult.phone_number);
            eDept.val(inpResult.deptName);
            ePos.val(inpResult.posName);
            eProj.val(inpResult.projName);
            $("body").css("cursor", "inherit");
            $(".modal-remove").addClass("show-modal");
         });
      });
   });
}
const empEditModule = () => {
   const editBtns = document.querySelectorAll(".empEditBtn");
   editBtns.forEach(item => {
      item.addEventListener("click", () => {
         empEditModal.classList.remove('d-none');
         let id = item.value;
         $.post("http://localhost:3000/api/employee-data", {
           emp_id: id
         }, (res) => {
            const result = res.result[0];
            empName.value = result.first_name;
            empMName.value = result.middle_name;
            inpSurname.value = result.last_name;
            fatherName.value = result.father_name;
            inpDob.value = result.dob;
            qAddress.value = result.q_address;
            yAddress.value = result.y_address;
            inpSSN.value = result.SSN;
            inpFIN.value = result.FIN;
            pNumber.value = result.phone_number;
            hNumber.value = result.home_number;
            shiftStart.value = result.shift_start_t;
            inpShiftEnd.value = result.shift_end_t;
            jStartDate.value = result.j_start_date;
            dayOffDays.value = result.dayoff_days_total;
            workingDays.value = result.working_days;
         });
      });
   });
   empModalCloseBtn.addEventListener('click', () => {
      empEditModal.classList.add("d-none");
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
         let activeClass = document.querySelector('.active');
         let index = pgItems.indexOf(activeClass);
         pgItems[index].classList.remove('active');
         item.classList.add('active');
         activeClass = document.querySelector('.active');
         index = pgItems.indexOf(activeClass);
         if(pgItems.length > 10) {
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
            $.post('http://localhost:3000/api/emp-by-page', {
               offset: offset
            }, (res) => {
               let tbody = $("tbody");
               let trs = "";
               tbody.text("");
               let emps = res.result;
               console.log(emps);
               for (let i = 0; i < emps.length; i++) {
                  if (emps[i].j_end_date) {
                     tdClass = 'text-danger';
                     tdText = 'İşdən Ayrılıb'
                  } else {
                     tdClass = 'text-success';
                     tdText = 'İşləyir';
                  }
                  trs +=
                      `
                    <tr>
                        <td></td>
                        <td>${emps[i].first_name}</td>
                        <td>${emps[i].last_name}</td>
                        <td>${emps[i].father_name}</td>
                        <td>${emps[i].phone_number}</td>
                        <td>${emps[i].deptName}</td>
                        <td>${emps[i].posName}</td>
                        <td>${emps[i].projName}</td>
                        <td class="${tdClass}">${tdText}</td>
                        <td class="d-flex justify-content-between last-td btn-group" style="position: relative">
                             <a class="btn btn-outline-danger btn-sm" href="/employee/delete/${emps[i].id}"><i class="bi bi-person-x"></i></a>
                             <button class="btn btn-outline-danger btn-sm empRmBtn" value="${emps[i].id}"><i class="bi bi-dash-circle"></i></button>
                             <button class="btn btn-outline-secondary btn-sm empEditBtn" value="${emps[i].id}" "><i class="bi bi-pencil-square"></i></button>
                         </td>
                    </tr>
                `
               }
               if(trs.length !== 0) {
                  tbody.html(trs);
               } else {
                  tbody.text("No Data Found");
               }
               loading.classList.add('d-none');
            });
            setTimeout(() => {
               empRemModule();
               empEditModule();
            }, 500);
         }, 1000);
      });
   });

}
const renderPage = () => {
   $.post("http://localhost:3000/api/all-employee", (res) => {
      let tbody = document.querySelector('tbody');
      let result = res.result;
      let role = res.role;
      let count = res.count[0].empCount;
      let html = '';
      let pgHtml = '';
      let tdClass = '';
      let tdText = '';
      count = Math.ceil(count / 15);

      if(role === "super_admin") {
         for (let i = 0; i < result.length; i++) {
            if (result[i].j_end_date) {
               tdClass = 'text-danger';
               tdText = 'İşdən Ayrılıb'
            } else {
               tdClass = 'text-success';
               tdText = 'İşləyir';
            }


            html += `
         <tr>
             <td></td>
             <td>${result[i].first_name}</td>
             <td>${result[i].last_name}</td>
             <td>${result[i].father_name}</td>
             <td>${result[i].phone_number}</td>
             <td>${result[i].deptName}</td>
             <td>${result[i].posName}</td>
             <td>${result[i].projName}</td>
              <td><span class="${tdClass}">${tdText}</span></td>
             <td class="d-flex justify-content-between last-td btn-group" style="position: relative">
                 <a class="btn btn-outline-danger btn-sm" href="/employee/delete/${result[i].id}"><i class="bi bi-person-x"></i></a>
                 <button class="btn btn-outline-danger btn-sm empRmBtn" value="${result[i].id}"><i class="bi bi-dash-circle"></i></button>
                 <button class="btn btn-outline-secondary btn-sm empEditBtn" value="${result[i].id}" "><i class="bi bi-pencil-square"></i></button>
             </td>
         </tr>
      `
         }
         tbody.innerHTML = html;
         for (let i = 1; i <= count; i++) {
            if (i === 1) {
               pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
               if(count > 21) {
                  pgHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
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
               }
               pgHtml += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            }
         }
         pgContainer.innerHTML = pgHtml;
         setTimeout(() => {
            loading.classList.add("d-none");
         }, 200);
         empRemModule();
         pageFuncs();
         empEditModule();
      }
   });
}

setTimeout(renderPage, 2000);