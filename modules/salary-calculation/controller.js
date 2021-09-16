const { calculate } = require("./service");
let errors = [];
module.exports = {
    calculate: (req, res) => {
        calculate((err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "asdasdsads");
                return res.render("calculation-salary/table", {
                    errors
                });
            }
            console.log(result);
            return res.render("calculation-salary/table", {
                calculation: result
            });
        });
    }
}