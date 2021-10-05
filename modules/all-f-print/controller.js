const { getFPrints, getNoFPrints } = require("./service");
let errors = [];


module.exports = {
    getAllFPrints: async (req, res) => {
        errors = [];
        try {
            let fResult = await getFPrints();
            let nFResult = await getNoFPrints();
            if(req.user.role === 1) {
                return res.render("fprint-selector", {
                    super_admin: true,
                    fResult,
                    nFResult
                });
            } else if (req.user.role === 5) {
                return res.render("fprint-selector", {
                    hr: true,
                    fResult,
                    nFResult
                });
            }
        } catch (err) {
            errors.push({msg: "An unknown error has been occurred please contact System Admin"});
            if(req.user.role === 1) {
                return res.render("fprint-selector", {
                    super_admin: true,
                    errors
                });
            } else if (req.user.role === 5) {
                return res.render("fprint-selector", {
                    hr: true,
                    errors
                });
            }
        }
    }
}