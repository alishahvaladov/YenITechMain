const { searchFPrint, renderFPrints, getFPrintsByPage } = require("./service");

module.exports = {
    searchFPrint: async (req, res) => {
        const data = req.body;
        let result = await searchFPrint(data);

        res.send({
            result
        });
    },
    renderFPrints: async (req, res) => {
        try {
            let fPrints = await renderFPrints();
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
            let fPrints = await getFPrintsByPage(data);
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
    }
}