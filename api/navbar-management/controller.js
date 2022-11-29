const { getNavbars, getGroupsForNav, addNavbarAGroupRel, removeNavbarAGroupRel } = require("./service");

module.exports = {
    getNavbars: async (req, res) => {
        try {
            const { name, offset } = req.query;
            const result = await getNavbars(name, offset);
            result.success = true;

            return res.status(200).send(result);
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getGroupsForNav: async (req, res) => {
        try {
            const { id } = req.query;
            const result = await getGroupsForNav(id);
            result.success = true;
            return res.status(200).send(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    addNavbarAGroupRel: async (req, res) => {
        try {
            const { nav_id, agroup_id} = req.query;
            await addNavbarAGroupRel(nav_id, agroup_id);
            return res.status(201);
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    removeNavbarAGroupRel: async (req, res) => {
        try {
            const { nav_id, agroup_id} = req.query;
            await removeNavbarAGroupRel(nav_id, agroup_id);
            return res.status(201);
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}