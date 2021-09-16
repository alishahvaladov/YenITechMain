const { Department } = require("../../db_config/models");

module.exports = {
    addDepartment: (data, cb) => {
        Department.create({
            name: data.name,
            user_id: parseInt(data.user_id),
            project_id: data.project_id,
            department_manager_id: data.department_manager_id
        }).then((results) => {
            console.log(results);
            cb();
        }).catch((err) => {
            if (err) throw err;
            cb(err);
        });
    },
    deleteDepartment: (id, cb) => {
        Department.destroy({
            where: {
                id: id
            }
        }).then((dept) => {
            console.log(dept);
            cb(null, dept);
        }).catch((err) => {
            console.log(err);
            cb(err);
        })
    },
    getDepartments: (cb) => {
        Department.findAll({
            attributes: ['id', 'name', 'project_id', 'department_manager_id']
        }).then((dept) => {
            cb(null, dept);
        }).catch((err) => {
            cb(err);
        })
    },
    updateDepartment: (id, data, cb) => {
        Department.update({
            name: data.name,
            project_id: data.project_id,
            department_manager_id: data.department_manager_id
        }, {
            where: {
                id: id
            }
        }).then((results) => {
            cb(null, results);
        }).catch(err => {
            cb(err);
        });
    },
    getDepartment: (id, cb) => {
        Department.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'project_id', 'department_manager_id']
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    }
}
