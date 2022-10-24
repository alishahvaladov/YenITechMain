const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");
const qEmpInput = document.querySelector("#qEmp");
const qUsernameInput = document.querySelector("#qUsername");
const qEmailInput = document.querySelector("#qEmail");
const qRoleInput = document.querySelector("#qRole");
let qEmp, qUsername, qEmail, qRole;



const getSearchInputValues = () => {
    qEmp = document.querySelector("#qEmp").value;
    qUsername = document.querySelector("#qUsername").value;
    qEmail = document.querySelector("#qEmail").value;
    qRole = document.querySelector("#qRole").value;
}

const pageFunctions = () => {
   let pgItems = document.querySelectorAll('.pagination-item');
   let fTDots = document.querySelector('.fTDots');
   let lTDots = document.querySelector('.lTDots');
   pgItems = Array.from(pgItems);
   console.log(pgItems);
   pgItems.forEach(item => {
       item.addEventListener("click", () => {
           loading.classList.remove('d-none');
           let offset = parseInt(item.value) - 1;
           let activeClass = document.querySelector('.pagination-active');
           let index = pgItems.indexOf(activeClass);
           pgItems[index].classList.remove('pagination-active');
           item.classList.add('pagination-active');
           activeClass = document.querySelector('.pagination-active');
           index = pgItems.indexOf(activeClass);
           if(pgItems.length > 21) {
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
               getSearchInputValues();
               $.post(`http://localhost:3000/api/users/deleted-users`, {
                  qEmp,
                  qUsername,
                  qEmail,
                  qRole,
                  offset
               }, (searchResult) => {
                   let count = searchResult.count[0].count;
                   count = Math.ceil(parseInt(count) / 15);
                   const deletedUsers = searchResult.deletedUsers;
                   let html = "";
             
                      deletedUsers.forEach(deletedUser => {
                      html += `
                         <tr>
                            <td>${deletedUser.first_name} ${deletedUser.last_name} ${deletedUser.father_name}</td>
                            <td>${deletedUser.username}</td>
                            <td>${deletedUser.deleted_by}</td>
                            <td>${deletedUser.email}</td>
                            <td>${deletedUser.role}</td>
                         </tr>
                      `
                   });
             
                   tbody.innerHTML = html;

                   loading.classList.add('d-none');
               });
           }, 1000);
       });
   });
}

const renderPage = () => {
    getSearchInputValues();
    $.post(`http://localhost:3000/api/users/deleted-users`, {
        qEmp,
        qUsername,
        qEmail,
        qRole,
        offset: 0
    }, (searchResult) => {
      console.log(searchResult);
      let count = searchResult.count[0].count;
      count = Math.ceil(parseInt(count) / 15);
      const deletedUsers = searchResult.deletedUsers;
      let html = "";

         deletedUsers.forEach(deletedUser => {
         html += `
            <tr>
               <td>${deletedUser.first_name} ${deletedUser.last_name} ${deletedUser.father_name}</td>
               <td>${deletedUser.username}</td>
               <td>${deletedUser.deleted_by}</td>
               <td>${deletedUser.email}</td>
               <td>${deletedUser.role}</td>
            </tr>
         `
      });

      tbody.innerHTML = html;
      
      let pgHtml = "";

      if (count === 1) {
         pagination.classList.add('d-none');
      } else {
         pagination.classList.remove('d-none');
         for (let i = 1; i <= count; i++) {
            if (i === 1) {
               pgHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
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
      }

      pageFunctions();
   });
   loading.classList.add("d-none");
}

qEmpInput.addEventListener("keyup", () => {
   renderPage();
});

qUsernameInput.addEventListener("keyup", () => {
   renderPage();
});

qEmailInput.addEventListener("keyup", renderPage);

qRoleInput.addEventListener("change", renderPage);

setTimeout(renderPage, 1000);