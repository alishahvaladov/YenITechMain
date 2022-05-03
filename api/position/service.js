const { sequelize, Position, DeptPosRel } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getDepartmentsForPoisiton: async () => {
        return await sequelize.query(`
            SELECT * FROM Departments
            WHERE deletedAt IS NULL
        `, {
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
    addDeptPostRel: (data, cb) => {
        DeptPosRel.create({
            department_id: data.department_id,
            position_id: data.position_id
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    checkIfDeptExists: async (id) => {
        return await sequelize.query(`
            SELECT * FROM Departments
            WHERE deletedAt IS NULL
            AND id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getPositionsByDepartment: async (deptId) => {
        return await sequelize.query(`
            SELECT pos.* FROM Positions as pos
            LEFT JOIN DeptPosRels as dpr ON dpr.position_id = pos.id
            WHERE pos.deletedAt IS NULL
            AND dpr.department_id = :deptId
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                deptId
            }
        });
    },
    getAllPositions: async (offset) => {
        const result = {};

        const positions = await sequelize.query(`
            SELECT id, name FROM Positions
            WHERE deletedAt IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        const count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Positions
            WHERE deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT,
        });

        result.positions = positions;
        result.count = count;
        return result;
    }
} 