const { getProjects, getProjectsForEmpForm, getProjectManagersAndParentProjects, getProjectById, updateProject, getProjectsForExport, addProject } = require("./service");
const { Project } = require("../../db_config/models")
const excelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = {
    getProjects: async (req, res) => {
        let offset = req.params.offset;
        offset = parseInt(offset) * 15;
        const body = req.body;
        try {
            const result = await getProjects(offset, body);

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
    },
    exportDataToExcel: async (req, res) => {
        try {
            const data = req.body;
            const date = new Date();
            const filename = `${date.getTime()}-layihələr.xlsx`;
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let projectData = await getProjectsForExport(data);
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Layihələr");
            worksheet.columns= [
                {header: "Layihə Adı", key: "name", width: 10},
                {header: "Address", key: "address", width: 10},
                {header: "Layihə Meneceri", key: "project_manager", width: 10},
            ];
            projectData.forEach(project => {
                const projectDataFromDB = {
                    name: project.name,
                    address: project.address,
                    project_manager: `${project.first_name} ${project.last_name} ${project.father_name}`,
                };
                worksheet.addRow(projectDataFromDB);
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
            res.download(excelPath, "Layihələr.xlsx");
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    addProject: (req, res) => {
        try {
            const body = req.body;
            const data = {};
            data.user_id = req.user.id;
            console.log(body);

            if (body.name && body.name !== "") {
                data.name = body.name
            } else {
                return res.status(400).send({
                    success: false,
                    field: "name",
                    message: "Zəhmət olmasa layihə adını qeyd edin"
                });
            }

            if (body.address && body.address !== "") {
                data.address = body.address;
            } else {
                return res.status(400).send({
                    success: false,
                    field: "address",
                    message: "Zəhmət olmasa addresi qeyd edin"
                });
            }

            if (body.project_manager_id && body.project_manager_id !== "") {
                data.project_manager_id = body.project_manager_id;
            } else {
                return res.status(400).send({
                    success: false,
                    field: "project_manager_id",
                    message: "Zəhmət olmasa layihə menecerini seçin"
                });
            }

            if (body.parent_id && body.parent_id !== "") {
                data.parent_id = body.parent_id;
            } else {
                data.parent_id = null;
            };

            Project.findOne({
                where: {
                    name: data.name
                }
            }).then((project) => {
                if(project) {
                    return res.status(400).send({
                        success: false,
                        field: "name",
                        message: "This project name already exists. Try other name"
                    });
                } else {
                    addProject(data, (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).send({
                                success: false,
                                field: "none",
                                message: "Ups... Something went wrong!"
                            });
                        }
                        return res.status(201).send({
                            success: true,
                            message: "Project has been added"
                        });
                    });
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                field: "none",
                message: "Ups... Something went wrong"
            });
        }
    }
}