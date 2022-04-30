const { getProjects } = require("./service");

module.exports = {
    getProjects: async (req, res) => {
        try {
            const projectData = await getProjects();

            return res.status(200).send({
                success: true,
                project: projectData
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