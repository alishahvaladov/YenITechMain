const { getProjectsForDepartments, addDepartment, addProjDeptRel, checkIfProjectExists, getDepartmentsByProject, getAllDepartments, getDepartmentByID, updateDepartmentName, getProjDeptRel, deleteProjeDeptRel, insertProjDeptRel } = require("./service");
const randomId = (count) => {
    const string = "abcdefghijklmnopqrstuvwxyz123456789";
    let generatedId = "";
    for (let i = 1; i <= count; i++) {
        generatedId += string.charAt(Math.floor(Math.random() * (string.length - 1)));
    }
    return generatedId;
}


module.exports = {
    getProjectsForDepartments: async (req, res) => {
        try {
            const result = await getProjectsForDepartments();
            result.forEach(project => {
                const generatedId = randomId(15);
                project.generatedId = generatedId;
            })
            return res.status(200).send({
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "An unkown error has been occured"
            });
        }
    },
    addDepartment: (req, res) => {
        const body = req.body;
        const deptData = {};
        if (body.departmentName.length < 1) {
            return res.status(400).send({
                success: false,
                message: "Please fill department name input"
            });
        }
        deptData.name = body.departmentName;
        deptData.user_id = req.user.id;
        const projects = body.projects;
        if (!projects) {
            return res.status(400).send({
                success: false,
                message: "Please choose at least one project"
            });
        }
        if (typeof projects !== "object") {
            return res.status(400).send({
                success: false,
                message: "IP adresin və user məlumatların Auditə göndərildi ərizəni yazmağa başla"
            });
        }
        projects.forEach(async (project) => {
            const foundProject = await checkIfProjectExists(parseInt(project));
            if (!foundProject) {
                return res.status(400).send({
                    success: false,
                    message: "One of chosen project does not exists please be careful when choosing it or contact system admin"
                });
            }
        });
        addDepartment(deptData, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    success: false,
                    message: "An unkown error has been occurred"
                });
            }
            let data = {};
            const deptId = result.dataValues.id;
            data.department_id = deptId;
            let message = ["Department has been added"];
            projects.forEach((project) => {
                data.project_id = project;
                addProjDeptRel(data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return message.push("Some parts can be missing please contact system adming");
                    }
                });
            });
            return res.status(200).send({
                success: true,
                message: message
            });
        });
    },
    getDepartmentsByProject: async (req, res) => {
        const projectId = req.params.id;
        try {
            const result = await getDepartmentsByProject(projectId);

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
    getAllDepartments: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;
            const result = await getAllDepartments(offset);

            return res.status(200).send({
                success: true,
                departments: result.departments,
                count: result.count
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong",
            });
        }
    },
    getDepartmentByID: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getDepartmentByID(id);
            result.projects.forEach(project => {
                const generatedId = randomId(15);
                project.generatedId = generatedId;
            });
            return res.status(200).send({
                success: true,
                name: result.departmentName,
                projects: result.projects,
                proj_dept: result.projectsForDepartment
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    updateDepartmentName: (req, res) => {
        try {
            const id = req.params.department_id;
            const name = req.query.name;
            const data = {};

            if (name === "" || !name) {
                return res.status(400).send({
                    success: false,
                    message: "Department name should be added"
                });
            }

            data.id = id;
            data.name = name;

            updateDepartmentName(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "Some data missing."
                    });
                }

                return res.status(201).send({
                    success: true,
                    message: "Deprtment has been updated"
                });
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    updateProjDeptRel: async (req, res) => {
        try {
            const project_id = req.query.project_id;
            const department_id = req.params.department_id;

            const data = {};

            if (project_id === "" || !project_id) {
                return res.status(400).send({
                    success: false,
                    message: "Project should be selected"
                });
            }

            if (department_id === "" || !department_id) {
                return res.status(400).send({
                    success: false,
                    message: "Department should be selected"
                });
            }

            data.project_id = project_id;
            data.department_id = department_id;

            const projDeptRel = await getProjDeptRel(data);
            console.log(projDeptRel.length);

            if (projDeptRel.length > 0) {
                deleteProjeDeptRel(data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "An unknown error has been occurred. Please contact system admin"
                        });
                    }
                    console.log(result);
                    return res.status(200).send({
                        success: true,
                        message: "Department has been deleted"
                    });
                });
            } else {
                insertProjDeptRel(data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({
                            success: false,
                            message: "An unknown error has been occurred. Please contact system admin."
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: "Department has been updated"
                    });
                });
            }
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    }
}