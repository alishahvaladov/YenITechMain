const { getFPrints } = require("./service");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
let errors = [];

module.exports = {
    getFPrints: async (req, res) => {
        const result = await getFPrints();
        for (let i = 0; i < result.length; i++) {
            let createdAt = result[i].createdAt.toLocaleDateString();
            result[i].createdAt = createdAt;
        }
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
    },
    addFPrintToDB: (req, res) => {
        const file = req.file.path;
        console.log(file);
        readXlsxFile(file).then((rows) => {
            console.log(rows);
        });
        return res.redirect("/fprints");
    },
}