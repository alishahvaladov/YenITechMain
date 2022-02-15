const { getNoFPrints } = require("./service");

module.exports = {
    getNoFPrints: async (req, res) => {
        try {
            const data = req.body;
            let result = await getNoFPrints(data);

            res.send({
                result
            });
        } catch (e) {
            req.flash("error_msg", "An unkown error has been occurred");
            return res.redirect("/fprints");
        }
    }
}