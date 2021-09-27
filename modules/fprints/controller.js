const { getFPrints } = require("./service");
let errors = [];

module.exports = {
    getFPrints: async (req, res) => {
        const result = await getFPrints();
        console.log(result);
        try {
            if(req.user.role === 1) {
                res.render("fprint/fprints", {
                    super_admin: true,
                    result
                });
            } else if (req.user.role === 5) {
                res.render("fprint/fprints", {
                    hr: true,
                    result
                });
            }
        } catch (err) {
            errors.push({msg: "No Record For Today"});
            if(req.user.role === 1) {
                res.render("fprint/fprints", {
                    super_admin: true,
                    errors
                });
            } else if (req.user.role === 5) {
                res.render("fprint/fprints", {
                    hr: true,
                    errors
                });
            }
        }
    }
}