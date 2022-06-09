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
            SELECT dpr.* FROM Positions AS pos
            LEFT JOIN DeptPosRels AS dpr ON dpr.position_id = pos.id
            WHERE pos.deletedAt IS NULL
            AND pos.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });

        result.departments = await sequelize.query(`
            SELECT id, name FROM Departments
            WHERE deletedAt IS NULL
        `, {
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
    }
}