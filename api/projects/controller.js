const { getProjects } = require("./service");

module.exports = {
    getProjects: async (req, res) => {
        let offset = req.params.offset;
        offset = parseInt(offset) * 15;
        try {
            const result = await getProjects(offset);

            return res.status(200).send({
                success: true,
                project: result.projects,
                count: result.count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}