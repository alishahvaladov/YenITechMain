const { sequelize, Position, PosGroupRel } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getGroupsForPositions: async () => {
        return await sequelize.query("SELECT * FROM `Groups`", {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    addPosition: (data, cb) => {
        Position.create({
            user_id: data.user_id,
            name: data.name
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    addGroupPosRel: (data, cb) => {
        PosGroupRel.create({
            group_id: data.group_id,
            position_id: data.position_id
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    checkIfGroupExists: async (id) => {
        return await sequelize.query( "SELECT * FROM `Groups`" + 
        `WHERE deletedAt IS NULL
         AND id = :id`, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getPositionsByGroup: async (groupID) => {
        return await sequelize.query(`
            SELECT pos.* FROM Positions as pos
            LEFT JOIN PosGroupRels as pgr ON pgr.position_id = pos.id
            WHERE pos.deletedAt IS NULL
            AND pgr.department_id = :groupID
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                groupID
            }
        });
    },
    getAllPositions: async (offset, body) => {
        const result = {};
        const replacements = {};

        let query = `
            SELECT id, name FROM Positions
            WHERE deletedAt IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Positions
            WHERE deletedAt IS NULL
        `;

        if (body.qName && body.qName !== "") {
            query += `
                AND name like :qName
            `;
            countQuery += `
                AND name like :qName
            `;
            replacements.qName = `%${body.qName}%`
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = offset;

        result.positions = await sequelize.query(query, {
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
    getPositionByID: async (id) => {
        const result = {};

        result.name = await sequelize.query(`
            SELECT name FROM Positions
            WHERE deletedAt IS NULL
            AND id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.dept_pos = await sequelize.query(`
            SELECT pgr.* FROM Positions AS pos
            LEFT JOIN PosGroupRels AS pgr ON pgr.position_id = pos.id
            WHERE pos.deletedAt IS NULL
            AND pos.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.groups = await sequelize.query("SELECT id, name FROM `Groups` WHERE deletedAt IS NULL", {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
    },
    getDepartmentForPositions: async (data) => {
        return await sequelize.query(`
            SELECT * FROM DeptPosRels
            WHERE department_id = :department_id
            AND position_id = :position_id
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                department_id: data.department_id,
                position_id: data.position_id
            }
        });
    },
    insertDepartmentForPosition: (data, cb) => {
        DeptPosRel.create({
            department_id: data.department_id,
            position_id: data.position_id
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    deleteDepartmentForPosition: (data, cb) => {
        DeptPosRel.destroy({
            where: {
                department_id: data.department_id,
                position_id: data.position_id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    updatePositionName: (data, cb) => {
        Position.update({
            name: data.name
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getPoistionsForExport: async (body) => {
        const replacements = {};

        let query = `
            SELECT id, name FROM Positions
            WHERE deletedAt IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Positions
            WHERE deletedAt IS NULL
        `;

        if (body.qName && body.qName !== "") {
            query += `
                AND name like :qName
            `;
            countQuery += `
                AND name like :qName
            `;
            replacements.qName = `%${body.qName}%`
        }

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}