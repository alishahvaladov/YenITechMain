const { getGroupsForPositions, addPosition, addGroupPosRel, checkIfGroupExists, getPositionsByGroup, getAllPositions, getPositionByID, updatePositionName, getDepartmentForPositions, deleteDepartmentForPosition, insertDepartmentForPosition, getPoistionsForExport } = require("./service");
const randomId = (count) => {
    const string = "abcdefghijklmnopqrstuvwxyz123456789";
    let generatedId = "";
    for (let i = 1; i <= count; i++) {
        generatedId += string.charAt(Math.floor(Math.random() * (string.length - 1)));
    }
    return generatedId;
}
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");


module.exports = {
    getGroupsForPositions: async (req, res) => {
        try {
            const result = await getGroupsForPositions();
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
        try {
            const body = req.body;
            const name = body.posName;
            const groups = body.groups;
            const posData = {};

            if (name.length < 1) {
                return res.status(400).send({
                    success: false,
                    message: "Please fill position input"
                });
            }
            posData.name = name;
            posData.user_id = req.user.id;
            if (!groups) {
                return res.status(400).send({
                    success: false, 
                    message: "Please check at least one group"
                });
            }
            if (typeof groups !== "object") {
                return res.status(400).send({
                    success: false,
                    message: "Please choose correct groups"
                });
            }
            if (groups.length > 0) {
                groups.forEach(async group => {
                    const checkedGroup = await checkIfGroupExists(group);
                    if (!checkedGroup) {
                        return res.status(404).send({
                            success: false,
                            message: "One of the chosen group does not exists please try again or contact system admin"
                        });
                    }
                });
                const groupData = {};
                addPosition(posData, (err, result) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "An unkown error has been occurred"
                        });
                    }
                    let message = ["Position successfully added"];
                    groupData.position_id = result.id;
                    groups.forEach(group => {
                        groupData.group_id = group;
                        addGroupPosRel(groupData, (err, result) => {
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
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getPositionsByGroup: async (req, res) => {
        const groupID = req.params.id;
        try {
            const result = await getPositionsByGroup(groupID);

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
            const body = req.body;
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;

            const result = await getAllPositions(offset, body);
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
                groups: result.groups,
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
                    console.log(data);
                    console.log(result);
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
    },
    exportDataToExcel: async (req, res) => {
        try {
            const data = req.body;
            const date = new Date();
            const filename = `${date.getTime()}-vəzifələr.xlsx`;
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let positionData = await getPoistionsForExport(data);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Vəzifələr");
            worksheet.columns= [
                {header: "Vəzifə Adı", key: "name", width: 10},
            ]
            positionData.forEach(position => {
                const posDataFromDB = {
                    name: position.name
                };
                worksheet.addRow(posDataFromDB);
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
            res.download(excelPath, "Vəzifələr.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}