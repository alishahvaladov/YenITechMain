const { QueryTypes } = require("sequelize");
const { sequelize, DeviceManagement } = require("../../db_config/models");

module.exports = {
    getDevices: async (data) => {
        let query = `
            SELECT * FROM DeviceManagements
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM DeviceManagements
        `;
        const replacements = {};
        const result = {};

        if (data.name && data.name !== "") {
            query += `
                WHERE json_string like :name
            `;
            countQuery += `
                WHERE json_string like :name
            `;
            replacements.name = `%${data.name}%`;
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = data.offset;

        result.devices = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        return result;
    },
    addDevices: (data, cb) => {
        DeviceManagement.create(data, {
            logging: false
        }).then((res) =>{
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getDeviceById: async (id) => {
        return sequelize.query(`
            SELECT json_string FROM DeviceManagements
            WHERE id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    updateDevice: (data, cb) => {
        DeviceManagement.update({
            json_string: data.json_string
        }, {
            where: {
                id: data.id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    deleteDevice: (id, cb) => {
        DeviceManagement.destroy({
            where: {
                id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    }
}