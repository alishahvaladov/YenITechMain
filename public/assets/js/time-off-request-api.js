const tbody = document.querySelector("tbody");
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
            url: `http://localhost:3000/api/time-off/upload-letter/${emp_id}`,
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
    $.get("http://localhost:3000/api/time-off", (res) => {
        console.log(res);
        const timeOffs = res.timeOffs;
        let html = "";
        if(res.timeOffs.length < 1) {
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
                        <td class="bg-secondary"><button class="btn text-light shadow-none" style="cursor: inherit">Sənəd Əksikdir</button></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 1){
                        status = `<td class="bg-warning"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(HR Təsdiq)</button></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 2) {
                        status = `<td class="bg-primary"><button class="btn text-light shadow-none" style="cursor: inherit">Emaldadır(Şöbə Rəhbəri Təsdiq)</button></td>
                        <td></td>
                        `
                    } else if (timeOff.status === 3) {
                        status = `
                        <td class="bg-info  p-1 border border-info rounded-3"><button class="btn text-light shadow-none" style="cursor: inherit">Əmr təsdiqi gözləyir</button></td>
                        <td class=""><button value="${timeOff.id}" class="bg-primary text-light p-1 border border-info rounded-3 download-letter"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                        `
                    } else if (timeOff.status === 4) {
                        status = `
                            <td class="bg-success"><button class="btn text-light shadow-none" style="cursor: inherit">Təsdiqləndi</button></td>
                            <td></td>
                        `
                    } else if (timeOff.status === 7) {
                        status = `<td class="bg-danger"><button class="btn text-light shadow-none" style="cursor: inherit">Ləğv Edildi</butt></td>
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
                    $.get(`http://localhost:3000/api/time-off/get-time-off-data/${tOffID}`, (res) => {
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


                            $.post("http://localhost:3000/api/time-off/emp-info", {
                                id: tOffID
                            }, (res) => {
                                $.post("http://localhost:3000/api/time-off/get-directors", {
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
                                    directorName,
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
    });
}
renderPage();