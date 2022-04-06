const pgContainer = document.querySelector('.pagination-container');
const loading = document.querySelector(".loading");
const empEditModal = document.querySelector(".employee-full-data-modal");
const empModalCloseBtn = document.querySelector(".empModalCloseBtn");
const exportToExcelBtn = document.querySelector("#exportToExcel");
const empEditCancelBtn = document.querySelector("#empEditCancelBtn");

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
let inpProject = document.querySelector("#project");
let inpDepartment = document.querySelector("#department");
let inpPosition = document.querySelector("#position");
let limit = document.querySelector("#limitCount");


let empInpName = $("#empName");
let empInpPhone = $("#empPhoneNumb");
let empDept = $("#empDept");
let empPos = $("#empPos");
let empProj = $("#empProj");
let empStatus = $("#empStatus");

let empInpNameVal = '';
let empInpPhoneVal = '';
let empDeptVal = '';
let empPosVal = '';
let empProjVal = '';
let empStatusVal = '';
let limitVal;

const getEmpInps = () => {
   empInpNameVal = $("#empName").val();
   empInpPhoneVal = $("#empPhoneNumb").val();
   empDeptVal = $("#empDept").val();
   empPosVal = $("#empPos").val();
   empProjVal = $("#empProj").val();
   empStatusVal = $("#empStatus").val();
   limitVal = $("#limitCount").val();
}
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
      $(this).on("click", () => {
         $("body").css("cursor", "progress");
         const id = $(this).val();
         $.post("http://localhost:3000/api/employee-data", {
            emp_id: id
         }, (res) => {
            const form = $("#remove-form");
            const inpResult = res.result.empRes[0];
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
            const empRes = res.result.empRes[0];
            const projRes = res.result.projRes;
            const deptRes = res.result.deptRes;
            const posRes = res.result.posRes;
            // const result = res.result[0];
            empName.value = empRes.first_name;
            empMName.value = empRes.middle_name;
            inpSurname.value = empRes.last_name;
            fatherName.value = empRes.father_name;
            inpDob.value = empRes.dob;
            qAddress.value = empRes.q_address;
            yAddress.value = empRes.y_address;
            inpSSN.value = empRes.SSN;
            inpFIN.value = empRes.FIN;
            pNumber.value = empRes.phone_number;
            hNumber.value = empRes.home_number;
            shiftStart.value = empRes.shift_start_t;
            inpShiftEnd.value = empRes.shift_end_t;
            jStartDate.value = empRes.j_start_date;
            dayOffDays.value = empRes.dayoff_days_total;
            workingDays.value = empRes.working_days;
            let projOptions = '';
            for (let i = 0; i < projRes.length; i++) {
               projOptions += `
                  <option value="${projRes[i].id}">${projRes[i].name}</option>
               `
            }
            let deptOptions = '';
            for (let i = 0; i < deptRes.length; i++) {
               deptOptions += `
                  <option value="${deptRes[i].id}">${deptRes[i].name}</option>
               `
            }
            let posOptions = '';
            for (let i = 0; i < posRes.length; i++) {
               posOptions += `
                  <option value="${posRes[i].id}">${posRes[i].name}</option>
               `
            }
            inpProject.innerHTML = projOptions;
            inpDepartment.innerHTML = deptOptions;
            inpPosition.innerHTML = posOptions;

            inpProject = document.querySelector("#project");
            inpDepartment = document.querySelector("#department");
            inpPosition = document.querySelector("#position");

            inpProject.value = empRes.project_id;
            inpDepartment.value = empRes.department;
            inpPosition.value = empRes.position_id;
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
         getEmpInps();
         setTimeout(() => {
            $.post('http://localhost:3000/api/emp-by-page', {
               offset: offset,
               empInpNameVal,
               empInpPhoneVal,
               empDeptVal,
               empPosVal,
               empProjVal,
               empStatusVal,
               limit: limitVal
            }, (res) => {
               let tbody = $("tbody");
               let trs = "";
               tbody.text("");
               let emps = res.result;
               let role = res.role;
               if(role === "super_admin") {
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
                           <td>${emps[i].first_name + " " + emps[i].last_name + " " + emps[i].father_name}</td>
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
               } else if (role === "hr") {
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
                           <td>${emps[i].first_name + " " + emps[i].last_name + " " + emps[i].father_name}</td>
                           <td>${emps[i].phone_number}</td>
                           <td>${emps[i].deptName}</td>
                           <td>${emps[i].posName}</td>
                           <td>${emps[i].projName}</td>
                           <td class="${tdClass}">${tdText}</td>
                           <td class="d-flex justify-content-between last-td btn-group" style="position: relative">
                                <button class="btn btn-outline-danger btn-sm empRmBtn" value="${emps[i].id}"><i class="bi bi-dash-circle"></i></button>
                                <button class="btn btn-outline-secondary btn-sm empEditBtn" value="${emps[i].id}" "><i class="bi bi-pencil-square"></i></button>
                            </td>
                       </tr>
                   `
                  }
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
   getEmpInps();
   $.post("http://localhost:3000/api/all-employee", {
      empInpNameVal,
      empInpPhoneVal,
      empDeptVal,
      empPosVal,
      empProjVal,
      empStatusVal,
      limit: limitVal
   }, (res) => {
      let tbody = document.querySelector('tbody');
      let result = res.result;
      let role = res.role;
      let count = res.count[0].count;
      let html = '';
      let pgHtml = '';
      let tdClass = '';
      let tdText = '';
      count = Math.ceil(count / parseInt(limitVal));

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
             <td>${result[i].first_name + " " + result[i].last_name + " " + result[i].father_name}</td>
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
               if (count > 1) {
                  pgHtml += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
               }
               
            }
         }
         pgContainer.innerHTML = pgHtml;
         setTimeout(() => {
            loading.classList.add("d-none");
         }, 200);
         empRemModule();
         pageFuncs();
         empEditModule();
      } else if (role === "hr") {
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
             <td>${result[i].first_name + " " + result[i].last_name + " " + result[i].father_name}</td>
             <td>${result[i].phone_number}</td>
             <td>${result[i].deptName}</td>
             <td>${result[i].posName}</td>
             <td>${result[i].projName}</td>
              <td><span class="${tdClass}">${tdText}</span></td>
             <td class="d-flex justify-content-between last-td btn-group" style="position: relative">
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
   empEditCancelBtn.addEventListener("click", () => {
      empEditModal.classList.add('d-none');
   });
}
const exportToExcel = () => {
   getEmpInps();
   const method = "post";
   let params = {
      empInpNameVal,
      empInpPhoneVal,
      empDeptVal,
      empPosVal,
      empProjVal,
      empStatusVal,
      limit: "all"
   }
   let form = document.createElement('form');
   form.setAttribute("method", method);
   form.setAttribute("action", "http://localhost:3000/api/download-excel");

   for (let key in params) {
      if (params.hasOwnProperty(key)) {
         const hiddenField = document.createElement("input");
         hiddenField.setAttribute('type', 'hidden');
         hiddenField.setAttribute('name', key);
         hiddenField.setAttribute('value', params[key]);
         form.appendChild(hiddenField);
      }
   }
   document.body.appendChild(form);
   form.submit();
}

exportToExcelBtn.addEventListener("click", () => {
   exportToExcel();
});

limit.addEventListener("change", () => {
   loading.classList.remove("d-none");
   setTimeout(() => {
      renderPage();
   }, 2000);
}); 


empInpName.keyup(renderPage);
empInpPhone.keyup(renderPage);
empDept.keyup(renderPage);
empPos.keyup(renderPage);
empProj.keyup(renderPage);
empStatus.change(renderPage);


setTimeout(renderPage, 2000);