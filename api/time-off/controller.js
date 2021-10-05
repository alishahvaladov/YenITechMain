const { getEmpInfo } = require("./service");

module.exports = {
    getEmpInfo: async (req, res) => {
        const id = req.body.id;
        const result = await getEmpInfo(id);

        res.send({
            result
        })
    }
}