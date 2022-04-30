const { Department } = require("../../db_config/models");

module.exports = {
    addDepartment: (data, cb) => {
        Department.create({
            name: data.name,
            user_id: parseInt(data.user_id),
        }).then((results) => {
            cb(null, results);
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
            cb(null, dept);
        }).catch((err) => {
            cb(err);
        })
    },
    getDepartments: (cb) => {
        Department.findAll({
            attributes: ['id', 'name']
        }).then((dept) => {
            cb(null, dept);
        }).catch((err) => {
            cb(err);
        })
    },
    updateDepartment: (id, data, cb) => {
        Department.update({
            name: data.name
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
            attributes: ['id', 'name']
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    }
}
