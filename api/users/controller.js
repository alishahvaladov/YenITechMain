const { getUser, updatePassword, getAllUsers, getDeletedUsers, getDeleterUser } = require("./service");
const jsonConfig = require("../../config/config.json");

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
            const result = await getAllUsers(offset);
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
            const limit = req.body.limit;
            const offset = req.body.offset;
            const roles = jsonConfig.roles;
            
            if (qRole !== "" && isNaN(parseInt(qRole))) {
                return res.status(400).send({
                    success: false,
                    message: "Role must be number"
                });
            }

            if (isNaN(parseInt(limit)) || isNaN(parseInt(offset))) {
                return res.status(400).send({
                    success: false,
                    message: "Limit or offset must be a number"
                });
            }
            
            deletedUserData.qEmp = qEmp;
            deletedUserData.qUsername = qUsername;
            deletedUserData.qEmail = qEmail;
            deletedUserData.qRole = qRole;
            deletedUserData.limit = parseInt(limit);
            deletedUserData.offset = parseInt(limit) * parseInt(offset);

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
    }
    
}