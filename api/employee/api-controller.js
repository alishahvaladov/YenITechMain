const { getDepartment, getPosition, getEmployee, empRenderPage, getEmpCount, empRenderByPage } = require("./service");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");


module.exports = {
    getDepartment: async (req, res) => {
        const id = req.body.id;
        console.log(req);
        const result = await getDepartment(id);
        console.log(result);
        res.send({
            result: result
        });
    },
    getPosition: async (req, res) => {
        const projID = req.body.projID;
        const deptID = req.body.deptID;

        const result = await getPosition(deptID, projID);

        res.send({
            result: result
        });
    },
    getEmployee: async (req, res) => {
        const id = req.body.emp_id;
        try {
            let result = await getEmployee(id);
            res.send({
                result: result
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            return res.redirect("/employee");
        }
    },
    empRenderPage: async (req, res) => {
        try {
            let body = req.body;
            console.log(body);
            let result = await empRenderPage(body);
            let role = '';
            if(req.user.role === 1) {
                role = 'super_admin'
            } else if (req.user.role === 5) {
                role = 'hr';
            }
            return res.send({
                result: result.result,
                count: result.count, 
                role
            });
        } catch (err) {
            console.log(err);
            return res.send({
                error: "An unknown error has been occurred"
            })
        }
    },
    empRenderByPage: async (req, res) => {
        try {
            const body = req.body;
            let role = req.user.role;
            if (role === 5) {
                role = "hr";
            } else if (role === 1) {
                role = "super_admin"
            }
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let result = await empRenderByPage(offset, body);
            res.send({
                result,
                role
            });
        } catch (e) {
            console.log(e);
            req.flash("error_msg", "An unknown error has been occurred");
            return res.redirect("/employees");
        }
    },
    exportDataToExcel: async (req, res) => {
        const data = req.body;
        console.log(data.empInpName);
        const date = new Date();
        const filename = `${date.getTime()}-əməkdaşlar.xlsx`;
        let offset = req.body.offset;
        offset = (offset - 1) * 10;
        let empData = await empRenderPage(data);
        empData = empData.result;
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Əməkdaşlar");
        worksheet.columns= [
            {header: "Adı", key: "first_name", width: 10},
            {header: "Soyadı", key: "last_name", width: 10},
            {header: "Ata adı", key: "father_name", width: 10},
            {header: "Cinsiyyətti", key: "sex", width: 10},
            {header: "Doğum tarixi", key: "dob", width: 10},
            {header: "Qeydiyyatda olduğu ünvan", key: "q_address", width: 10},
            {header: "Faktiki ünvan", key: "y_address", width: 10},
            {header: "SSN", key: "SSN", width: 10},
            {header: "FIN", key: "FIN", width: 10},
            {header: "Mobil telefon nömrəsi", key: "phone_number", width: 10},
            {header: "Ev telefon nömrəsi", key: "home_number", width: 10},
            {header: "İşə gəlmə saatı", key: "shift_start_t", width: 10},
            {header: "İşdən ayrılma saatı", key: "shift_end_t", width: 10},
            {header: "İşə başlama tarixi", key: "j_start_date", width: 10},
            {header: "İşdən ayrılma tarixi", key: "j_end_date", width: 10},
            {header: "Ümumi məzuniyyəti", key: "dayoff_days_total", width: 10},
            {header: "Layihə", key: "projName", width: 10},
            {header: "Departament", key: "deptName", width: 10},
            {header: "Vəzifə", key: "posName", width: 10},
            {header: "İş günləri", key: "working_days", width: 10}
        ]
        empData.forEach(employee => {
            const empDataFromDB = {
                first_name: employee.first_name,
                last_name: employee.last_name,
                father_name: employee.father_name,
                sex: employee.sex,
                dob: employee.dob,
                q_address: employee.q_address,
                y_address: employee.y_address,
                SSN: employee.SSN,
                FIN: employee.FIN,
                phone_number: employee.phone_number,
                home_number: employee.home_number,
                shift_start_t: employee.shift_start_t,
                shift_end_t: employee.shift_end_t,
                j_start_date: employee.j_start_date,
                j_end_date: employee.j_end_date,
                dayoff_days_total: employee.dayoff_days_total,
                projName: employee.projName,
                deptName: employee.deptName,
                posName: employee.posName,
                working_days: employee.working_days
            };
            worksheet.addRow(empDataFromDB);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });
        const excelPath = path.join((__dirname), `../../public/excels/${filename}`);
        console.log(excelPath);
        await workbook.xlsx.writeFile(excelPath);
        setTimeout(() => {
           fs.unlink(excelPath, (err) => {
                if(err) {
                    console.log(err);
                    res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
           });
        }, 10000);
        res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.download(excelPath, "Əməkdaşlar.xlsx");
    }
}