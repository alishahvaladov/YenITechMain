const { getNavs } = require('./service');

module.exports = {
    getNavs: async (req, res) => {
        try {
            const role = req.user.role;
            const result = await getNavs(role);
            return res.status(200).send({
                success: true,
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}