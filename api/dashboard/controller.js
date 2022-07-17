const {
    getEmployeeCount,
    getGivenSalariesByMonths,
    getInappropriateFPrintsCount,
    getLastMonthEmployeeCount,
    getLastMonthSalaryCount,
    getLastNotifications,
    getLastTimeOffs,
    getSalarySumForEachDepartment
} = require("./service");
const dateForMonth = new Date();
const month = dateForMonth.getMonth() + 1;
const year = dateForMonth.getFullYear();


module.exports = {
    getEmployeeCount: async (req, res) => {
        try {
            const result = await getEmployeeCount();
            
            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getGivenSalariesByMonths: async (req, res) => {
        try {
            const result = await getGivenSalariesByMonths(year);
            console.log(year)
            return res.status(200).send({
                success: true,
                result
            });

        } catch (err) {
            console.log(err);
            return res.statsu(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getInappropriateFPrintsCount: async (req, res) => {
        try {
            const result = await getInappropriateFPrintsCount();

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getLastMonthEmployeeCount: async (req, res) => {
        try {
            const result = await getLastMonthEmployeeCount(month);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    getLastMonthSalaryCount: async (req, res) => {
        try {
            const result = await getLastMonthSalaryCount(month);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getLastNotifications: async (req, res) => {
        try {
            const role = parseInt(req.user.role);
            const result = await getLastNotifications(role);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getLastTimeOffs: async (req, res) => {
        try {
            const result = await getLastTimeOffs();

            return res.status(200).send({
                success: false,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getSalarySumForEachDepartment: async (req, res) => {
        try {
            const user_id = req.user.id;
            const result = await getSalarySumForEachDepartment(user_id);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}