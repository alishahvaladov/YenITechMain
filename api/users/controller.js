const { getUser, updatePassword, getAllUsers } = require("./service");
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
    }
}