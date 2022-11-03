const tbody = document.querySelector("tbody");
const loading = document.querySelector(".loading");
const pgContainer = document.querySelector(".pagination-container");
const pagination = document.querySelector(".pagination");
const exportToExcelBtn = document.querySelector("#exportToExcel");

const qEmployeeInput = document.querySelector("#qEmployee");
const qTypeInput = document.querySelector("#qType");
const qStartDateInput = document.querySelector("#qStartDate");
const qEndDateInput = document.querySelector("#qEndDate");
const qJStartDateInput = document.querySelector("#qJStartDate");
const qStatusInput = document.querySelector("#qStatus");

let qEmployee, qType, qStartDate, qEndDate, qJStartDate, qStatus;

const getSearchData = () => {
    qEmployee = qEmployeeInput.value;
    qType = qTypeInput.value;
    qStartDate = qStartDateInput.value;
    qEndDate = qEndDateInput.value;
    qJStartDate = qJStartDateInput.value;
    qStatus = qStatusInput.value;
}

const qStartReset = document.querySelector("#qStartReset");
const qEndReset = document.querySelector("#qEndReset");
const qJStartReset = document.querySelector("#qJStartReset")



const pageFunctions = () => {
    let pgItems = document.querySelectorAll('.pagination-item');
    let fTDots = document.querySelector('.fTDots');
    let lTDots = document.querySelector('.lTDots');
    pgItems = Array.from(pgItems);
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
                getSearchData();
                $.post(`/api/time-off?offset=${offset}`, {
                    qEmployee,
                    qType,
                    qStartDate,
                    qEndDate,
                    qJStartDate,
                    qStatus
                }, (res) => {
                    let up = "";
                    let html = "";
                    const timeOffs = res.result.timeoffs;
                    console.log(timeOffs);
                    if(timeOffs.length < 1) {
                        tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
                    } else {
                        timeOffs.forEach(timeOff => {
                            if (timeOff.timeoff_type !== 4) {
                                let status;
                                if(timeOff.timeoff_type === 2) {
                                    timeOff.timeoff_type = "Əmək məzuniyyəti"
                                } else if (timeOff.timeoff_type === 1) {
                                    timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                                } else if (timeOff.timeoff_type === 3) {
                                    timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                                }
                                if(timeOff.status === 0) {
                                    status = `
                                    <td><span class="badge bg-secondary" style="cursor: inherit">Sənəd Əksikdir</span></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 1){
                                    status = `<td><span class="badge bg-warning">Emaldadır(HR)</span></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 2) {
                                    status = `<td><span class="badge bg-primary">Emaldadır(Şöbə Rəhbəri)</span></td>
                                    <td></td>
                                    `
                                } else if (timeOff.status === 3) {
                                    status = `
                                    <td><span class="badge bg-info">Əmr təsdiqi gözləyir</span></td>
                                    <td class=""><button value="${timeOff.id}" class="bg-primary text-light p-1 border border-info rounded-3 download-letter"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                                    `
                                } else if (timeOff.status === 4) {
                                    status = `
                                        <td><span class="badge bg-success">Təsdiqləndi</span></td>
                                        <td></td>
                                    `
                                } else if (timeOff.status === 7) {
                                    status = `<td><span class="badge bg-danger">Ləğv Edildi</butt></td>
                                    <td></td>
                                    `
                                }
                                html += `
                                    <tr> 
                                        <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                                        <td>${timeOff.timeoff_type}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                                        <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                                        ${status} 
                                        <td></td>
                                    </tr>
                                `
                            }
                        });
                        tbody.innerHTML = html;
                        let downloadLetters = document.querySelectorAll(".download-letter");
                        downloadLetters.forEach(downloadLetter => {
                            downloadLetter.addEventListener("click", () => {
                                let tOffID = downloadLetter.value;
                                $.get(`/api/time-off/get-time-off-data/${tOffID}`, (res) => {
                                    console.log(res);
                                    document.querySelector(".t-o-m-request").classList.remove("d-none");
                                    const downloadDoc = document.querySelector("#downloadDoc");
                                    const submitUploadBtn = document.querySelector("#submitUploadBtn");
                                    downloadDoc.addEventListener("click", () => {
                                        let uplaodDoc = document.querySelector("#uploadDoc");
                                        uploadDoc.disabled = false;
                                        let emrNo = document.querySelector("#emrNo");
                                        emrNo = emrNo.value;
                                        const date = new Date()
                                        const time = date.getTime();
                                        let dateUpRight = new Date(time);
                                        dateUpRight = dateUpRight.toLocaleDateString();
                                        dateUpRight = dateUpRight.split("/");
                                        dateUpRight = `${dateUpRight[1]}.${dateUpRight[0]}.${dateUpRight[2]}`;
                                        console.log(dateUpRight);
                                        const result = res.result[0];
                                        const project = result.projName;
                                        const projectAddress = result.projAddress;
                                        let dayOffType;
                                        if (result.timeoff_type === 1) {
                                            dayOffType = "Öz hesabına məzuniyyət"
                                        } else if (result.timeoff_type === 2) {
                                            dayOffType = "Əmək məzuniyyəti"
                                        } else if (result.timeoff_type === 3) {
                                            dayOffType = "Sağlamlıq məzuniyyəti"
                                        }
                                        const dayOffS = dateToAzVersion(result.timeoff_start_date);
                                        const dayStart = new Date(result.timeoff_start_date);
                                        const dayOffE = dateToAzVersion(result.timeoff_end_date);
                                        const dayEnd = new Date(result.timeoff_end_date);
                                        const wStartDate = dateToAzVersion(result.timeoff_job_start_date);
                                        let nameSurnameFatherSex;
                                        if (result.sex === 0) {
                                            nameSurnameFatherSex = `${result.first_name} ${result.last_name} ${result.father_name} oğlu`
                                        } else if (result.sex === 1) {
                                            nameSurnameFatherSex = `${result.first_name} ${result.last_name} ${result.father_name} qızı`
                                        }
                                        const department = result.deptName;
                                        const position = result.posName;
                                        let dayOffD = dayEnd.getTime() - dayStart.getTime();
                                        dayOffD = dayOffD / (1000 * 3600 * 24);
                                        const dayOffDWithWords = new NumberAzeriTranslator(dayOffD);
                                        dayOffD = `${dayOffD}(${dayOffDWithWords.translate()})`;
                                        let directorName;
                                        const emp_id = result.emp_id;
                                        submitUploadBtn.addEventListener("click", () => {
                                            sendTimeOffRequest(emp_id, tOffID);
                                            document.querySelector(".t-o-m-request").classList.add("d-none");
                                            setTimeout(renderPage, 500);
                                        });
            
            
                                        $.post("/api/time-off/emp-info", {
                                            id: tOffID
                                        }, (res) => {
                                            $.post("/api/time-off/get-directors", {
                                                projID: result.project_id,
                                                deptID: result.department
                                            }, (res) => {
                                                directorName = `${res.result.director[0].first_name} ${res.result.director[0].last_name}`;
                                            });
                                        });
            
                                        if (emrNo !== "" && emrNo !== " ") {
                                            const params = {
                                                project,
                                                dayOffType,
                                                dayOffS,
                                                dayOffE,
                                                wStartDate,
                                                nameSurnameFatherSex,
                                                department,
                                                position,
                                                projectAddress,
                                                time,
                                                dayOffD,
                                                directorName: "Mahir Mammadzada",
                                                dateUpRight,
                                                emrNo
                                            }
                                            $.ajax({
                                                method: "post",
                                                url: "http://localhost:5000/day-off/letter/validate",
                                                data: params,
                                                dataType: 'json',
                                                success: function(json, status) {
                                                    if (json.success === true) {
                                                        const method = "post";
                                                        let form = document.createElement('form');
                                                        form.setAttribute("method", method);
                                                        form.setAttribute("action", "http://localhost:5000/day-off/letter/download");
                                                        
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
                                                    } else if (json.success === false ) {
                                                        alert(json.message);
                                                    }
                                                },
                                                error: function(result, status, err) {
                                                    console.log(result);
                                                    console.log(status);
                                                    console.log(err);
                                                }
                                            });
                                            const method = "post";
                                        } else {
                                            alert("Əmr nömrəsini daxil edin");
                                        }
                                    }); 
                                });
                            });
                        });
                    }
                    tbody.innerHTML = html;
                    loading.classList.add('d-none');
                });
            }, 1000);
        });
    });
}

const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
}
const sendTimeOffRequest = (emp_id, id) => {
    let fd = new FormData();
    let file = uploadDoc.files[0];
    if (file) {
        fd.append('file', file);
        fd.append('id', id);
        $.ajax({
            url: `/api/time-off/upload-letter/${emp_id}`,
            type: "post", 
            data: fd,
            enctype: "multipart/form-data",
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
            }
        })
    }
    
}
const renderPage = () => {
    getSearchData();
    $.post("/api/time-off?offset=0", {
        qEmployee,
        qType,
        qStartDate,
        qEndDate,
        qJStartDate,
        qStatus
    }, (res) => {
        console.log(res);
        const timeOffs = res.result.timeoffs;
        let count = res.result.count[0].count;
        count = Math.ceil(count / 15); 
        let html = "";
        if (count <= 1) {
            pagination.classList.add("d-none");
        } else {
            pagination.classList.remove("d-none");
        }
        if(timeOffs.length < 1) {
            tbody.innerHTML = `<p class="text-danger">No Data Found</p>`
        } else {
            timeOffs.forEach(timeOff => {
                if (timeOff.timeoff_type !== 4) {
                    let status;
                    if(timeOff.timeoff_type === 2) {
                        timeOff.timeoff_type = "Əmək məzuniyyəti"
                    } else if (timeOff.timeoff_type === 1) {
                        timeOff.timeoff_type = "Öz hesabına məzuniyyət"
                    } else if (timeOff.timeoff_type === 3) {
                        timeOff.timeoff_type = "Sağlamlıq məzuniyyəti"
                    }
                    if(timeOff.status === 0) {
                        status = `
                        <td><span class="badge bg-secondary" style="cursor: inherit">Sənəd Əksikdir</span></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 1){
                        status = `<td><span class="badge bg-warning">Emaldadır(HR)</span></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 2) {
                        status = `<td><span class="badge bg-primary">Emaldadır(Şöbə Rəhbəri)</span></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 3) {
                        status = `
                        <td><span class="badge bg-info">Əmr təsdiqi gözləyir</span></td>
                        <td class=""><button value="${timeOff.id}" class="bg-primary text-light p-1 border border-info rounded-3 download-letter"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                        `
                    } else if (timeOff.status === 4) {
                        status = `
                            <td><span class="badge bg-success">Təsdiqləndi</span></td>
                            <td></td>
                        `
                    } else if (timeOff.status === 7) {
                        status = `<td><span class="badge bg-danger">Ləğv Edildi</butt></td>
                        <td></td>
                        `
                    }
                    html += `
                        <tr> 
                            <td>${timeOff.first_name} ${timeOff.last_name} ${timeOff.father_name}</td>
                            <td>${timeOff.timeoff_type}</td>
                            <td>${dateToAzVersion(timeOff.timeoff_start_date)}</td>
                            <td>${dateToAzVersion(timeOff.timeoff_end_date)}</td>
                            <td>${dateToAzVersion(timeOff.timeoff_job_start_date)}</td>
                            ${status} 
                            <td></td>
                        </tr>
                    `
                }
            });
            tbody.innerHTML = html;
            let downloadLetters = document.querySelectorAll(".download-letter");
            downloadLetters.forEach(downloadLetter => {
                downloadLetter.addEventListener("click", () => {
                    let tOffID = downloadLetter.value;
                    $.get(`/api/time-off/get-time-off-data/${tOffID}`, (res) => {
                        console.log(res);
                        document.querySelector(".t-o-m-request").classList.remove("d-none");
                        const downloadDoc = document.querySelector("#downloadDoc");
                        const submitUploadBtn = document.querySelector("#submitUploadBtn");
                        downloadDoc.addEventListener("click", () => {
                            let uplaodDoc = document.querySelector("#uploadDoc");
                            uploadDoc.disabled = false;
                            let emrNo = document.querySelector("#emrNo");
                            emrNo = emrNo.value;
                            const date = new Date()
                            const time = date.getTime();
                            let dateUpRight = new Date(time);
                            dateUpRight = dateUpRight.toLocaleDateString();
                            dateUpRight = dateUpRight.split("/");
                            dateUpRight = `${dateUpRight[1]}.${dateUpRight[0]}.${dateUpRight[2]}`;
                            console.log(dateUpRight);
                            const result = res.result[0];
                            const project = result.projName;
                            const projectAddress = result.projAddress;
                            let dayOffType;
                            if (result.timeoff_type === 1) {
                                dayOffType = "Öz hesabına məzuniyyət"
                            } else if (result.timeoff_type === 2) {
                                dayOffType = "Əmək məzuniyyəti"
                            } else if (result.timeoff_type === 3) {
                                dayOffType = "Sağlamlıq məzuniyyəti"
                            }
                            const dayOffS = dateToAzVersion(result.timeoff_start_date);
                            const dayStart = new Date(result.timeoff_start_date);
                            const dayOffE = dateToAzVersion(result.timeoff_end_date);
                            const dayEnd = new Date(result.timeoff_end_date);
                            const wStartDate = dateToAzVersion(result.timeoff_job_start_date);
                            let nameSurnameFatherSex;
                            if (result.sex === 0) {
                                nameSurnameFatherSex = `${result.first_name} ${result.last_name} ${result.father_name} oğlu`
                            } else if (result.sex === 1) {
                                nameSurnameFatherSex = `${result.first_name} ${result.last_name} ${result.father_name} qızı`
                            }
                            const department = result.deptName;
                            const position = result.posName;
                            let dayOffD = dayEnd.getTime() - dayStart.getTime();
                            dayOffD = dayOffD / (1000 * 3600 * 24);
                            const dayOffDWithWords = new NumberAzeriTranslator(dayOffD);
                            dayOffD = `${dayOffD}(${dayOffDWithWords.translate()})`;
                            let directorName;
                            const emp_id = result.emp_id;
                            submitUploadBtn.addEventListener("click", () => {
                                sendTimeOffRequest(emp_id, tOffID);
                                document.querySelector(".t-o-m-request").classList.add("d-none");
                                setTimeout(renderPage, 500);
                            });


                            $.post("/api/time-off/emp-info", {
                                id: tOffID
                            }, (res) => {
                                $.post("/api/time-off/get-directors", {
                                    projID: result.project_id,
                                    deptID: result.department
                                }, (res) => {
                                    directorName = `${res.result.director[0].first_name} ${res.result.director[0].last_name}`;
                                });
                            });

                            if (emrNo !== "" && emrNo !== " ") {
                                const params = {
                                    project,
                                    dayOffType,
                                    dayOffS,
                                    dayOffE,
                                    wStartDate,
                                    nameSurnameFatherSex,
                                    department,
                                    position,
                                    projectAddress,
                                    time,
                                    dayOffD,
                                    directorName: "Mahir Mammadzada",
                                    dateUpRight,
                                    emrNo
                                }
                                $.ajax({
                                    method: "post",
                                    url: "http://localhost:5000/day-off/letter/validate",
                                    data: params,
                                    dataType: 'json',
                                    success: function(json, status) {
                                        if (json.success === true) {
                                            const method = "post";
                                            let form = document.createElement('form');
                                            form.setAttribute("method", method);
                                            form.setAttribute("action", "http://localhost:5000/day-off/letter/download");
                                            
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
                                        } else if (json.success === false ) {
                                            alert(json.message);
                                        }
                                    },
                                    error: function(result, status, err) {
                                        console.log(result);
                                        console.log(status);
                                        console.log(err);
                                    }
                                });
                            } else {
                                alert("Əmr nömrəsini daxil edin");
                            }
                        }); 
                    });
                });
            });
        }

        let countHtml = "";

        for (let i = 1; i <= count; i++) {
            if (i === 1) {
                countHtml += `<button class="pagination-item f-item btn btn-outline-dark btn-sm pagination-active" value="${i}">${i}</button>`
                countHtml += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
            }
            if (i > 21 && i < count) {
                countHtml += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            } else if (i !== 1 && i !== count) {
                countHtml += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
            }
            if (i === count) {
                if(count > 21) {
                    countHtml += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                }
                if (count !== 1) {
                    countHtml += `
                        <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                    `
                }
            }
        }
        pgContainer.innerHTML = countHtml;

        loading.classList.add('d-none');
        pageFunctions();
    });
}

qEmployeeInput.addEventListener('keyup', renderPage);
qTypeInput.addEventListener("change", renderPage);
qStartDateInput.addEventListener('change', renderPage);
qEndDateInput.addEventListener("change", renderPage);
qJStartDateInput.addEventListener("change", renderPage);
qStatusInput.addEventListener("change", renderPage);

qStartReset.addEventListener("click", () => {
    qStartDateInput.value = "";
    renderPage();
});
qEndReset.addEventListener("click", () => {
    qEndDateInput.value = "";
    renderPage();
});
qJStartReset.addEventListener("click", () => {
    qJStartDateInput.value = "";
    renderPage();
});

const exportToExcel = () => {
    getSearchData();
    const method = "post";
    let params = {
        qEmployee,
        qType,
        qStartDate,
        qEndDate,
        qJStartDate,
        qStatus
    }
    let form = document.createElement('form');
    form.setAttribute("method", method);
    form.setAttribute("action", "/api/time-off/export-to-excel");

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


setTimeout(renderPage, 1000);