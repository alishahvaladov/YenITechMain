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
    }
}