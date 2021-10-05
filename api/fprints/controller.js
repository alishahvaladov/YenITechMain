const { searchFPrint } = require("./service");

module.exports = {
    searchFPrint: async (req, res) => {
        const data = req.body;
        let result = await searchFPrint(data);

        res.send({
            result
        });
    }
}