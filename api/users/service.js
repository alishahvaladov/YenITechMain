const { User, AccessGroup, UserAccessGroup, Right, sequelize} = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getUser: async (id) => {
        return await sequelize.query(`
            SELECT usr.id, usr.username, usr.email, usr.role, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            WHERE usr.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    updatePassword: (data, cb) => {
        User.update({
            password: data.password,
            active_status: 0
        }, {
            where: {
                id: data.id
            },
            logging: false
        }).then(res => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getAllUsers: async (offset, body) => {
        const result = {};
        const replacements = {};

        let query = `
            SELECT usr.id, emp.first_name, emp.last_name, emp.father_name, usr.username, usr.email, usr.role FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND usr.role != 1
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND usr.role != 1
        `;

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                countQuery += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        if (body.qUsername && body.qUsername !== "") {
            query += `
                AND usr.username like :qUsername
            `;
            countQuery += `
                AND usr.username like :qUsername
            `;
            replacements.qUsername = `%${body.qUsername}%`
        }

        if (body.qEmail && body.qEmail !== "") {
            query += `
                AND usr.email like :qEmail
            `;
            countQuery += `
                AND usr.email like :qEmail
            `;
            replacements.qEmail = `%${body.qEmail}%`;
        }

        if (body.qRole && body.qRole !== "") {
            query += `
                AND usr.role = :qRole
            `;
            countQuery += `
                AND usr.role = :qRole
            `;
            replacements.qRole = body.qRole;
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = offset;

        const users = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });


        const count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        result.users = users;
        result.count = count;
        return result;
    },
    getDeletedUsers: async (data) => {
        let query = `
            SELECT usr.id, usr.username, usr.role, usr.updatedAt, usr.email, usr.deleted_by, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.deletedAt IS NOT NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.deletedAt IS NOT NULL
        `;
        const replacements = {};
        const result = {};
        console.log(data);
        if (data.qEmp !== "" && data.qEmp) {
            const qEmp = data.qEmp.split(" ");
            if(qEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmp OR emp.last_name like :qEmp OR emp.father_name like :qEmp)
                `
                countQuery += `
                    AND (emp.first_name like :qEmp OR emp.last_name like :qEmp OR emp.father_name like :qEmp)
                `;
                replacements.qEmp = `%${qEmp[0]}%`
            }
            if (qEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmp AND emp.last_name like :qEmp2) OR (emp.first_name like :qEmp AND emp.father_name like :qEmp2) OR (emp.last_name like :qEmp AND emp.father_name like :qEmp2))
                `
                countQuery += `
                    AND ((emp.first_name like :qEmp AND emp.last_name like :qEmp2) OR (emp.first_name like :qEmp AND emp.father_name like :qEmp2) OR (emp.last_name like :qEmp AND emp.father_name like :qEmp2))
                `
                replacements.qEmp = `%${qEmp[0]}%`
                replacements.qEmp2 = `%${qEmp[1]}%`
            }
            if (qEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmp AND emp.last_name like :qEmp2 AND emp.father_name like :qEmp3)
                `
                countQuery += `
                    AND (emp.first_name like :qEmp AND emp.last_name like :qEmp2 AND emp.father_name like :qEmp3)
                `
                replacements.qEmp = `%${qEmp[0]}%`
                replacements.qEmp2 = `%${qEmp[1]}%`
                replacements.qEmp3 = `%${qEmp[2]}%`
            }
        }
        if (data.qUsername !== "" && data.qUsername) {
            query += `
                AND usr.username like :qUsername
            `
            countQuery += `
                AND usr.username like :qUsername
            `
            replacements.qUsername = `%${data.qUsername}%`;
        }
        if (data.qEmail !== "" && data.qEmail) {
            query += `
                AND usr.email like :qEmail
            `
            countQuery += `
                AND usr.email like :qEmail
            `
            replacements.qEmail = `%${data.qEmail}%`;
        }
        if (data.role !== "" && data.role && !isNaN(parseInt(data.role))) {
            query += `
                AND usr.role = :role
            `
            countQuery += `
                AND usr.role = :role
            `
            replacements.role = parseInt(data.role);
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = parseInt(data.offset);

        result.deletedUsers = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.deletedUsersCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        return result;
    },
    getDeleterUser: async (user_id) => {
        return await sequelize.query(`
            SELECT emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            WHERE usr.id = :user_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    },
    getUsersForExport: async (body) => {
        const replacements = {};

        let query = `
            SELECT usr.id, emp.first_name, emp.last_name, emp.father_name, usr.username, usr.email, usr.role, rol.name as RoleName FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            LEFT JOIN Roles AS rol ON rol.id = usr.role
            WHERE emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND usr.role != 1
        `;

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        if (body.qUsername && body.qUsername !== "") {
            query += `
                AND usr.username like :qUsername
            `;
            replacements.qUsername = `%${body.qUsername}%`
        }

        if (body.qEmail && body.qEmail !== "") {
            query += `
                AND usr.email like :qEmail
            `;
            replacements.qEmail = `%${body.qEmail}%`;
        }

        if (body.qRole && body.qRole !== "") {
            query += `
                AND usr.role = :qRole
            `;
            replacements.qRole = body.qRole;
        }

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    },
    getUserRoles: async () => {
        return await sequelize.query(`
            SELECT * FROM Roles
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    updateUserGroup: async function (userId, groupId) {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) throw new Error("User is not found.");

        const group = await AccessGroup.findOne({
            where: {
                id: groupId
            }
        });
        if (!group) throw new Error("Group is not found.");

        const isExist = await UserAccessGroup.findOne({
            where: {
                AccessGroupId: groupId,
                UserId: userId
            }
        })
        if (isExist) throw new Error("User already has this group.");

        await UserAccessGroup.create({
            AccessGroupId: groupId,
            UserId: userId
        })
    },
    removeUserFromGroup: async function (userId, groupId) {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) throw new Error("User is not found.");

        await UserAccessGroup.destroy({ 
            where: {
                AccessGroupId: groupId,
                UserId: userId
            }
        })
    },
    getUserGroup: async function (userId) {
        const result = [];
        const dbRecords = await sequelize.query(
          `
            SELECT ag.name as UAG_name, r.name as R_name FROM UserAccessGroups as uag
            LEFT JOIN AccessGroups as ag ON ag.id = uag.AccessGroupId
            LEFT JOIN AccessGroupRights as agr ON agr.AccessGroupId = ag.id
            LEFT JOIN Rights as r ON r.id = agr.RightId
            WHERE uag.UserId = :userId
          `,
          {
            type: QueryTypes.SELECT,
            replacements: { userId },
            logging: false,
          }
        );
        dbRecords.forEach((record) => {
          const index = result.findIndex((res) => res.name === record.UAG_name);
          if (index === -1) {
            result.push({
              name: record.UAG_name,
              rights: [record.R_name],
            });
          } else {
            result[index].rights.push(record.R_name);
          }
        });
        return result;
    }
}
