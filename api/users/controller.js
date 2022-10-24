const { getUser, updatePassword, getAllUsers, getDeletedUsers, getDeleterUser, getUsersForExport, getUserRoles } = require("./service");
const jsonConfig = require("../../config/config.json");
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    getUser: async (req, res) => {
        const id = req.params.id;
        const roles = jsonConfig.roles;

        try {
            const result = await getUser(id);

            return res.status(200).send({
                result,
                roles
            })
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "An unknown error has been occurred"
            });
        }
    },
    updatePassword: (req, res) => {
        const data = {};
        const body = req.body;
        const id = req.params.id;
        data.id = id;
        const password = body.password;
        const retypePassword = body.retypePassword;
        data.password = password;
        data.id = id;
        if (password !== retypePassword) {
            return res.status(400).send({
                success: false,
                message: "Passwords don't match"
            });
        }
        updatePassword(data, (err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "This user can't be found");
                return res.status(404).json({
                    success: false,
                    message: "This user can't be found"
                })
            }
            return res.status(200).send({
                success: true,
                message: "Password updated successfully"
            });
        });
    },
    getAllUsers: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;
            const body = req.body;
            const result = await getAllUsers(offset, body);
            return res.status(200).send({
                success: true,
                users: result.users,
                count: result.count
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong"
            });
        }
    },
    getDeletedUsers: async (req, res) => {
        try {
            const deletedUserData = {};
            const qEmp = req.body.qEmp;
            const qUsername = req.body.qUsername;
            const qEmail = req.body.qEmail;
            const qRole = req.body.qRole;
            const offset = req.body.offset;
            const roles = jsonConfig.roles;
            
            if (qRole !== "" && isNaN(parseInt(qRole))) {
                return res.status(400).send({
                    success: false,
                    message: "Role must be number"
                });
            }
            
            deletedUserData.qEmp = qEmp;
            deletedUserData.qUsername = qUsername;
            deletedUserData.qEmail = qEmail;
            deletedUserData.qRole = qRole;
            deletedUserData.offset = 15 * parseInt(offset);

            const result = await getDeletedUsers(deletedUserData);
            const deletedUsers = result.deletedUsers;
            let deletedBy;
            for (let i = 0; i < deletedUsers.length; i++) {
                deletedBy = await getDeleterUser(deletedUsers[i].deleted_by);
                deletedUsers[i].deleted_by = `${deletedBy[0].first_name} ${deletedBy[0].last_name} ${deletedBy[0].father_name}`;
                deletedUsers[i].role = roles[deletedUsers[i].role.toString()];
            }

            return res.status(200).send({
                success: true,
                deletedUsers,
                count: result.deletedUsersCount,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    exportDataToExcel: async (req, res) => {
        try {
            const data = req.body;
            const date = new Date();
            const filename = `${date.getTime()}-istifadəçilər.xlsx`;
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let userData = await getUsersForExport(data);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("İstifadəçilər");
            worksheet.columns= [
                {header: "Əməkdaş", key: "full_name", width: 10},
                {header: "İstifadəçi Adı", key: "username", width: 10},
                {header: "Email", key: "email", width: 10},
                {header: "Rol", key: "role", width: 10},
            ]
            userData.forEach(user => {
                const userDataFromDB = {
                    full_name: `${user.first_name} ${user.last_name} ${user.father_name}`,
                    username: user.username,
                    email: user.email,
                    role: user.RoleName
                };
                worksheet.addRow(userDataFromDB);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = {bold: true};
            });
            const excelPath = path.join((__dirname), `../../public/excels/${filename}`);
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
            res.download(excelPath, "İstifadəçilər.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getUserRoles: async (req, res) => {
        try {
            const result = await getUserRoles();

            return res.status(200).send({
                success: true,
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    }
}