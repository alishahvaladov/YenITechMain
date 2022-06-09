const { getProjects, getProjectsForEmpForm, getProjectManagersAndParentProjects, getProjectById, updateProject } = require("./service");

module.exports = {
    getProjects: async (req, res) => {
        let offset = req.params.offset;
        offset = parseInt(offset) * 15;
        try {
            const result = await getProjects(offset);

            return res.status(200).send({
                success: true,
                project: result.projects,
                count: result.count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error"
            });
        }
    },
    getProjectsForEmpForm: async (req, res) => {
        try {
            const emp_id = req.params.emp_id;
            const project = await getProjectsForEmpForm(emp_id);

            return res.status(200).send({
                success: true,
                project
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    getProjectManagersAndParentProjects: async (req, res) => {
        try {
            const result = await getProjectManagersAndParentProjects();

            return res.status(200).send({
                success: true,
                projectManagers: result.projectManagers,
                parentProjects: result.parentProjects
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    getProjectById: async (req, res) => {
        try {
            const project_id = req.params.project_id;
            if (isNaN(parseInt(project_id))) {
                return res.status(400).send({
                    success: false,
                    message: "Project id must be a number"
                });
            }
            const project = await getProjectById(project_id);

            return res.status(200).send({
                success: true,
                project
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    updateProject: (req, res) => {
        try {
            const body = req.body;
            if (body.name === "" && !body.name) {
                return res.status(400).send({
                    success: false,
                    message: "Project name must be included"
                });
            }

            if (body.parent_id === "" || !body.parent_id || body.parent_id === 0) {
                body.parent_id = null;
            }
            console.log(body);

            if (body.project_manager_id !== "" && !body.project_manager_id) {
                return res.status(400).send({
                    success: false,
                    message: "Project manager must be selected"
                });
            }

            updateProject(body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred"
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: "Project updated"
                });
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