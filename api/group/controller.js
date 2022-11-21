const { addGroup, getDepartmentsForGroups, getGroups, checkIfDepartmentExists, addDeptGroupRels, getAllGroupsByDepartment } = require("./service");

module.exports = {
    addGroup: (req, res) => {
        try {
            const body = req.body;
            const departments = body.departments;
            body.user_id = req.user.id;

            if (!body.name || body.name === "") {
                return res.status(400).send({
                    success: false,
                    message: "Zəhmət olmasa şöbə adını daxil edin."
                });
            }

            if (departments.length > 0) {
                departments.forEach(async department => {
                    const checkedDept = await checkIfDepartmentExists(department);
                    if (!checkedDept) {
                        return res.status(400).send({
                            succes: false,
                            message: "One of the checked department not exists. Please try again."
                        });
                    }
                });
                const deptData = {};
                addGroup(body, (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send({
                            success: false,
                            message: "Ups... Something went wrong!"
                        });
                    }
                    let message = ["Group successfully added"];
                    deptData.group_id = result.id;
                    departments.forEach(department => {
                        deptData.department_id = department;
                        addDeptGroupRels(deptData, (err, result) => {
                            if (err) {
                                message.push("Some parts can be missing. Please contact system admin");
                            }
                        })
                    });
                    return res.status(200).send({
                        success: true,
                        message: "Şöbə əlavə edildi"
                    });
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Please insert at least one department"
                });
            }

            
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getDepartmentsForGroups: async (req, res) => {
        try {
            const departments = await getDepartmentsForGroups();

            return res.status(200).send({
                departments
            });

        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getGroups: async (req, res) => {
        try {
            let { offset, qName } = req.query;

            const data = {};

            if (isNaN(parseInt(offset)) || offset === "") {
                return res.status(400).send({
                    success: false,
                    message: "Offset is not defined or not a number"
                });
            }

            if (qName && qName !== "") {
                data.qName = qName;
            }

            data.offset = parseInt(offset) * 15;

            const groups = await getGroups(data);

            return res.status(200).send({
                success: true,
                groups
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getAllGroupsByDepartment: async (req, res) => {
        try {
            const { department_id } = req.params;
            const result = await getAllGroupsByDepartment(department_id);

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