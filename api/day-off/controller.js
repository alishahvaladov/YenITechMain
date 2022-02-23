const { getTimeOffs } = require("./service");

module.exports = {
    getTimeOffs: async (req, res) => {
        const timeOffs = getTimeOffs();

        res.status(200).send({
            timeOffs
        });
    }
}