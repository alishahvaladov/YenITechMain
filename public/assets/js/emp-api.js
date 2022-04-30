const pgContainer = document.querySelector('.pagination-container');
const loading = document.querySelector(".loading");
const empEditModal = document.querySelector(".employee-full-data-modal");
const empModalCloseBtn = document.querySelector(".empModalCloseBtn");
const exportToExcelBtn = document.querySelector("#exportToExcel");
const empEditCancelBtn = document.querySelector("#empEditCancelBtn");
const profilePicture = document.querySelector("#profilePicture");

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
const fullDay = document.querySelector("#full_day");
const workingDays = document.querySelector("#workingDays");
let inpProject = document.querySelector("#project");
let inpDepartment = document.querySelector("#department");
let inpPosition = document.querySelector("#position");
let limit = document.querySelector("#limitCount");
const hiddenEmployeeId = document.querySelector("#employeeId");
const empEditApplyBtn = document.querySelector("#empEditApplyBtn");
const empUpdateInputs = document.querySelectorAll(".update-employee-input");


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
   const projSelector = $("#project");
   const deptSelector = $("#department");
   const posSelector = $("#position");
   editBtns.forEach(item => {
      item.addEventListener("click", () => {
         empEditModal.classList.remove('d-none');
         let id = item.value;
         $.post("http://localhost:3000/api/employee-data", {
           emp_id: id
         }, (res) => {
            const empRes = res.result.empRes[0];
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
            hiddenEmployeeId.value = id;

            if (empRes.working_days === "full_day") {
               fullDay.checked = true;
               workingDays.value = "Tam iş günləri";
               workingDays.disabled = true;
            } else {
               workingDays.value = empRes.working_days;
            }
            fullDay.addEventListener("change", () => {
               if (fullDay.checked === false) {
                  workingDays.value = "";
                  workingDays.type = "number";
                  workingDays.disabled = false;
               } else {
                  workingDays.type = "text";
                  workingDays.value = "Tam iş günləri";
                  workingDays.disabled = true;
               }
            });
            

            let projOptions = '';
            $.get(`http://localhost:3000/api/project/allProjects/`, (projRes) => {
               for (let i = 0; i < projRes.project.length; i++) {
                  if (empRes.project_id === projRes.project[i].id) {
                     projOptions += `
                        <option value="${projRes.project[i].id}" selected>${projRes.project[i].name}</option>
                     `   
                  } else {
                     projOptions += `
                        <option value="${projRes.project[i].id}">${projRes.project[i].name}</option>
                     `
                  }
               }
               inpProject.innerHTML = projOptions;
            });
            
            let deptOptions = '';
            $.get(`http://localhost:3000/api/department/by-project/${empRes.project_id}`, (res) => {
               const deptRes = res.result;
               for (let i = 0; i < deptRes.length; i++) {
                  if (deptRes[i].id === empRes.department) {
                     deptOptions += `
                        <option value="${deptRes[i].id}" selected>${deptRes[i].name}</option>
                     `   
                  } else {
                     deptOptions += `
                        <option value="${deptRes[i].id}">${deptRes[i].name}</option>
                     `
                  }
               }
               inpDepartment.innerHTML = deptOptions;
            });
            
            let posOptions = '';
            $.get(`http://localhost:3000/api/position/by-department/${empRes.department}`, (res) => {
               const posRes = res.result;
               for (let i = 0; i < posRes.length; i++) {
                  if (posRes[i].id === empRes.position_id) {
                     posOptions += `
                        <option value="${posRes[i].id}" selected>${posRes[i].name}</option>
                     `   
                  } else {
                     posOptions += `
                        <option value="${posRes[i].id}">${posRes[i].name}</option>
                     `
                  }
               }
               inpPosition.innerHTML = posOptions;
            });
            
            profilePicture.src = `employee/files/recruitment/${empRes.id}-${empRes.first_name.toLowerCase()}-${empRes.last_name.toLowerCase()}-${empRes.father_name.toLowerCase()}/${empRes.filename}`

            projSelector.change(() => {
               let id = projSelector.val();
               $.get(`http://localhost:3000/api/department/by-project/${id}`, (res) => {
                   const result = res.result;
                   deptSelector.text(" ");
                   deptSelector.append(`<option value="" hidden>Seçin</option>`)
                   for (let i = 0; i < result.length; i++) {
                       deptSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
                   }
                   posSelector.html(" ");
                   console.log(result);
               });
            });
           
           deptSelector.change(() => {
               let deptID = deptSelector.val();
               $.get(`http://localhost:3000/api/position/by-department/${deptID}`, (res) => {
                   const result = res.result;
                   posSelector.text(" ");
                   posSelector.append(`<option value="" hidden>Seçin</option>`)
                   for (let i = 0; i < result.length; i++) {
                       posSelector.append(`<option value="${result[i].id}">${result[i].name}</option>`);
                   }
                   console.log(result);
               });
           });

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
                           <td></td>
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
             <td></td>
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

empEditApplyBtn.addEventListener("click", () => {
   const data = {};
   empUpdateInputs.forEach(item => {
      data[item.name] = item.value;
   });
   $.post('http://localhost:3000/api/update-employee', {
      data
   }, (updateResult) => {
      console.log(updateResult);
      empEditModal.classList.add('d-none');
      loading.classList.remove('d-none');
      setTimeout(() => {
         renderPage();
         const updateNotification = document.querySelector('.update-notification-alert');
         const updateNotificationP = document.querySelector('.update-notification-p');
         updateNotification.classList.remove('d-none');
         updateNotificationP.innerHTML = updateResult.message;
         setTimeout(() => {
            updateNotification.classList.add('d-none');
         }, 1500)
      }, 1000);
   });
});

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