const { searchFPrint, renderFPrints, getFPrintsByPage, renderForgottenFPrints } = require("./service");

module.exports = {
    searchFPrint: async (req, res) => {
        try {
            const data = req.body;
            let result = await searchFPrint(data);

            res.send({
                result
            });
        } catch (e) {
            req.flash("error_msg", "An unkown error has been occurred");
            return res.redirect("/fprints");
        }
    },
    renderFPrints: async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            let fPrints = await searchFPrint(req.body);
            res.send({
                fPrints
            })
        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    getFPrintsByPage: async (req, res) => {
        const data = req.body;
        try {
            let fPrints = await searchFPrint(data);
            res.send({
                fPrints
            });

        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    renderForgottenFPrints: async (req, res) => {
        try {
            const result = await renderForgottenFPrints();
            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: true,
                message: "An unknown error has been occurred"
            });
        }
    }
}