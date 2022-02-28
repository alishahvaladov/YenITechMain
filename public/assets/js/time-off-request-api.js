const tbody = document.querySelector("tbody");
const dateToAzVersion = (date) => {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`
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
                    <td class=""><span class="bg-secondary text-light p-1 border border-secondary rounded-3">Sənəd Əksikdir</span></td>
                    <td></td>
                    `
                } else if (timeOff.status === 1){
                    status = `<td class=""><span class="bg-warning text-light p-1 border border-warning rounded-3">Emaldadır(HR Təsdiq)</span></td>
                    <td></td>
                    `
                } else if (timeOff.status === 2) {
                    status = `<td class=""><span class="bg-primary text-light p-1 border border-primary rounded-3">Emaldadır(Şöbə Rəhbəri Təsdiq)</span></td>
                    <td></td>
                    `
                } else if (timeOff.status === 3) {
                    status = `
                    <td class=""><span class="bg-success text-light p-1 border border-success rounded-3">Təsdiqləndi</span></td>
                    <td class=""><button id="downloadLetter" value="${timeOff.id}" class="bg-primary text-light p-1 border border-success rounded-3"><i class="bi bi-file-earmark-word"></i> Əmri Çap Et</button></td>
                    `
                } else if (timeOff.status === 7) {
                    status = `<td class=""><span class="bg-danger text-light p-1 border border-danger rounded-3">Ləğv Edildi</span></td>
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
            });
                tbody.innerHTML = html;
                let downloadLetter = document.querySelector("#downloadLetter");
                downloadLetter.addEventListener("click", () => {
                    let tOffID = downloadLetter.value;
                    $.get(`http://localhost:3000/api/time-off/get-time-off-data/${tOffID}`, (res) => {
                        console.log(res);
                        document.querySelector(".t-o-m-request").classList.remove("d-none");
                        const downloadDoc = document.querySelector("#downloadDoc");
                        downloadDoc.addEventListener("click", () => {
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
                                const method = "post";
                                let form = document.createElement('form');
                                form.setAttribute("method", method);
                                form.setAttribute("action", "http://localhost:5000/day_off/letter");
                                
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
                            } else {
                                alert("Əmr nömrəsini daxil edin");
                            }
                        }); 
                    });
                });
        }
        
    })
}
renderPage();