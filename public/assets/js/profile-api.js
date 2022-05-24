const username = document.querySelector("#username");
const name = document.querySelector("#name");
const father_name = document.querySelector("#father_name");
const dob = document.querySelector("#dob");
const y_address = document.querySelector("#y_address");
const fin = document.querySelector("#fin");
const home_number = document.querySelector("#home_number");
const j_start_date = document.querySelector("#j_start_date");
const project_id = document.querySelector("#project_id");
const position_id = document.querySelector("#position_id");
const email = document.querySelector("#email");
const surname = document.querySelector("#surname");
const sex = document.querySelector("#sex");
const q_address = document.querySelector("#q_address");
const ssn = document.querySelector("#ssn");
const phone_number = document.querySelector("#phone_number");
const shift_start = document.querySelector("#shift_start");
const shift_end = document.querySelector("#shift_end");
const day_off_days = document.querySelector("#day_off_days");
const department_id = document.querySelector("#department_id");
const working_days = document.querySelector("#working_days");
const cardNameSurname = document.querySelector("#card-name-surname");
const cardJobTitle = document.querySelector("#card-job-title");
const cardAddress = document.querySelector("#card-address");
const cardProject = document.querySelector("#card-project");
const loading = document.querySelector(".loading");


const renderPage = () => {
    $.get('http://localhost:3000/api/profile/profile-picture', (result) => {
        const filename = result.filename;
        const cardPP = document.querySelector("#card-pp");
        cardPP.src = filename;
    });

    $.get("http://localhost:3000/api/profile", (res) => {
        const profile = res.profile[0];
        console.log(profile);
        username.value = profile.username;
        name.value = profile.first_name;
        father_name.value = profile.father_name;
        dob.value = profile.dob;
        y_address.value = profile.y_address;
        fin.value = profile.FIN;
        home_number.value = profile.home_number;
        j_start_date.value = profile.j_start_date;
        project_id.value = profile.projName;
        position_id.value = profile.posName;
        email.value = profile.email;
        surname.value = profile.last_name;
        if (profile.sex === 1) {
            sex.value = "Qadın"
        } else {
            sex.value = "Kişi"
        }
        q_address.value = profile.q_address;
        ssn.value = profile.SSN;
        phone_number.value = profile.phone_number;
        shift_start.value = profile.shift_start_t;
        shift_end.value = profile.shift_end_t;
        day_off_days.value = profile.dayoff_days_total;
        department_id.value = profile.deptName;
        if (profile.working_days === 77) {
            working_days.value = "Tam iş günü"
        } else {
            working_days.value = profile.working_days;
        }
        cardNameSurname.innerHTML = `${profile.first_name} ${profile.last_name}`;
        cardJobTitle.innerHTML = profile.posName;
        cardAddress.innerHTML = profile.q_address;
        cardProject.innerHTML = profile.projName;
    });


    loading.classList.add('d-none');
}

setTimeout(renderPage, 500);