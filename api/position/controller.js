const { getDepartmentsForPoisiton, addPosition, addDeptPostRel, checkIfDeptExists, getPositionsByDepartment, getAllPositions, getPositionByID, updatePositionName, getDepartmentForPositions, deleteDepartmentForPosition, insertDepartmentForPosition } = require("./service");
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
    },
    getAllPositions: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;

            const result = await getAllPositions(offset);
            return res.status(200).send({
                success: true,
                positions: result.positions,
                count: result.count
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong!"
            });
        }
    },
    getPositionByID: async (req, res) => {
        try {
            const id = req.params.id;

            const result = await getPositionByID(id);

            return res.status(200).send({
                success: true,
                name: result.name,
                departments: result.departments,
                dept_pos: result.dept_pos
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    updatePositionName: (req, res) => {
        try {
            const id = req.params.id;
            const name = req.query.name;
            const data = {};

            if (name === "" || !name) {
                return res.status(400).send({
                    success: false,
                    message: "Some missing data"
                });
            }
            data.id = id;
            data.name = name;
            
            updatePositionName(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred. Please contact system admin"
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Position has been updated"
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    updateDeptPosRels: async (req, res) => {
        try {
            let position_id = req.query.position_id;
            let department_id =req.query.department_id;
            const data = {};

            if (isNaN(parseInt(position_id))) {
                return res.status(400).send({
                    success: false,
                    message: "Position ID must be a number"
                });
            }

            if(isNaN(parseInt(department_id))) {
                return res.status(400).send({
                    success: false,
                    message: "Department ID must be a number"
                });
            }

            data.position_id = parseInt(position_id);
            data.department_id = parseInt(department_id);

            const result = await getDepartmentForPositions(data);

            if (result.length > 0) {
                deleteDepartmentForPosition(data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "An unknown error has been occured"
                        });
                    }
                    return res.status(201).send({
                        success: false,
                        message: "Position has been deleted"
                    });
                });
            } else {
                insertDepartmentForPosition(data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "Position has been inserted"
                        });
                    }
                    return res.status(201).send({
                        success: false,
                        message: "Position has been inserted"
                    });
                });
            }


        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}