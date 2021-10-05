const { Project, sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    addProject: (data, cb) => {
        Project.create({
            user_id: data.user_id,
            name: data.name,
            address: data.address,
            project_manager_id: data.project_manager_id,
            parent_id: data.parent_id
        }).then((project) => {
            cb()
        }).catch(err => {
            cb(err);
        })
    },
    getProjects: (cb) => {
        Project.findAll({
            attributes: ['id', 'name', 'address', 'project_manager_id'],
            order: [['createdAt', 'DESC']],
            where: {
                parent_id: null
            }
        }).then((results) => {
            console.log(results);
            cb(null, results);
        }).catch((err) => {
            cb(err);
        });
    },
    getProject: (id, cb) => {
        Project.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    updateProject: (id, data, cb) => {
        Project.update({
            name: data.name,
            address: data.address,
            project_manager_id: data.project_manager_id,
            parent_id: data.parent_id
        }, {
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    deleteProject: (id, cb) => {
        Project.destroy({
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
           cb(err);
        });
    },
    getChildren: async (id) => {
        return await sequelize.query("SELECT * FROM Projects where parent_id = :id", {
            type: QueryTypes.SELECT,
            replacements: {id: id},
            logging: false
        });
    }
}