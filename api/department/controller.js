const { getProjectsForDepartments, addDepartment, addProjDeptRel, checkIfProjectExists, getDepartmentsByProject } = require("./service");
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
    }
}