const { getAllFPrints } = require("./service");
let errors = [];


module.exports = {
    getAllFPrints: async (req, res) => {
        errors = [];
        const data = req.body;
        try {
            const result = await getAllFPrints(data);
            res.status(200).json({
                result: result
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({
               success: false,
               message: "An unknown error has been occurred"
            });
        }
    }
}