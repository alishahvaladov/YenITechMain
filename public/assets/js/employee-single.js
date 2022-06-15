const loading = document.querySelector(".loading");
let url = window.location.href;
url = url.split("/");
const email = document.querySelector("#email");
const empName = document.querySelector("#name");
const surname = document.querySelector("#surname");
const father_name = document.querySelector("#father_name");
const sex = document.querySelector("#sex");
const dob = document.querySelector("#dob");
const q_address = document.querySelector("#q_address");
const y_address = document.querySelector("#y_address");
const ssn = document.querySelector("#ssn");
const fin = document.querySelector("#fin");
const phone_number = document.querySelector("#phone_number");
const home_number = document.querySelector("#home_number");
const shift_start = document.querySelector("#shift_start");
const shift_end = document.querySelector("#shift_end");
const j_start_date = document.querySelector("#j_start_date");
const day_off_days = document.querySelector("#day_off_days");
const project_id = document.querySelector("#project_id");
const department_id = document.querySelector("#department_id");
const position_id = document.querySelector("#position_id");
const working_days = document.querySelector("#working_days");

const emp_id = url[url.length - 1];

const renderPage = () => {
    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/employee-data`,
        data: {
            emp_id
        },
        success: (res => {
            const empRes = res.result.empRes[0];
            empName.value = empRes.first_name;
            surname.value = empRes.last_name;
            father_name.value = empRes.father_name;
            sex.value = empRes.sex;
            dob.value = empRes.dob;
            q_address.value = empRes.q_address;
            y_address.value = empRes.y_address;
            ssn.value = empRes.SSN;
            fin.value = empRes.FIN;
            phone_number.value = empRes.phone_number;
            home_number.value = empRes.home_number;
            shift_start.value = empRes.shift_start;
            shift_end.value = empRes.shift_end;
            j_start_date.value = empRes.j_start_date;
            day_off_days.value = empRes.dayoff_days_total;
            project_id.value = empRes.projName;
            department_id.value = empRes.deptName;
            position_id.value = empRes.posName;
            working_days.value = empRes.working_days;


            console.log(empRes);
        })
    }).catch((err) => {
        console.log(err);
    })
    loading.classList.add("d-none");
}

setTimeout(renderPage, 1000);