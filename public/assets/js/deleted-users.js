const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");
const pgContainer = document.querySelector(".pagination-container");
let qEmp, qUsername, qEmail, qRole;



const getSearchInputValues = () => {
    qEmp = document.querySelector("#qEmp").value;
    qUsername = document.querySelector("#qUsername").value;
    qEmail = document.querySelector("#qEmail").value;
    qRole = document.querySelector("#qRole").value;
}

const renderPage = () => {
    getSearchInputValues();
    $.post(`http://localhost:3000/api/users/deleted-users`, {
        qEmp,
        qUsername,
        qEmail,
        qRole,
        limit: 15,
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

      if (count === 1) {
         pagination.classList.add('d-none');
      } else {
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
      }
   });
   loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);