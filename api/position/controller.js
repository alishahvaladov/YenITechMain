const { getDepartmentsForPoisiton, addPosition, addDeptPostRel, checkIfDeptExists, getPositionsByDepartment } = require("./service");
const randomId = (count) => {
    const string = "abcdefghijklmnopqrstuvwxyz123456789";
    let generatedId = "";
    for (let i = 1; i <= count; i++) {
        generatedId += string.charAt(Math.floor(Math.random() * (string.length - 1)));
    }
    return generatedId;
}

module.exports = {
    getDepartmentsForPoisiton: async (req, res) => {
        try {
            const result = await getDepartmentsForPoisiton();
            result.forEach(dept => {
                const generatedId = randomId(15);
                dept.generatedId = generatedId;
            })
            return res.status(200).send({
                result
            });
        } catch(err) {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    addPosition: (req, res) => {
        const body = req.body;
        const name = body.posName;
        const depts = body.departments;
        const posData = {};

        if (name.length < 1) {
            return res.status(400).send({
                success: false,
                message: "Please fill position input"
            });
        }
        posData.name = name;
        posData.user_id = req.user.id;
        if (!depts) {
            return res.status(400).send({
                success: false, 
                message: "Please check at least one department"
            });
        }
        if (typeof depts !== "object") {
            return res.status(400).send({
                success: false,
                message: "Attempt to hacking your data sent to Audit"
            });
        }
        if (depts.length > 0) {
            depts.forEach(async dept => {
                const checkedDept = await checkIfDeptExists(dept);
                if (!checkedDept) {
                    return res.status(404).send({
                        success: false,
                        message: "One of the chosen department does not exists please try again or contact system admin"
                    });
                }
            });
            const deptData = {};
            addPosition(posData, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "An unkown error has been occurred"
                    });
                }
                let message = ["Position successfully added"];
                deptData.position_id = result.id;
                depts.forEach(dept => {
                    deptData.department_id = dept;
                    addDeptPostRel(deptData, (err, result) => {
                        if (err) {
                            console.log(err);
                            return message.push("Some parts can be missing please contact system admin");
                        }
                    })
                });
                return res.status(200).send({
                    success: true,
                    message
                });
            });
        } else {
            return res.status(400).send({
                success: false, 
                message: "Please check at least one department"
            });
        }
    },
    getPositionsByDepartment: async (req, res) => {
        const deptId = req.params.id;
        try {
            const result = await getPositionsByDepartment(deptId);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    }
}
