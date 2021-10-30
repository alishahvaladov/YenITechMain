const { getDepartment, getPosition, getEmployee } = require("./service");

module.exports = {
    getDepartment: async (req, res) => {
        const id = req.body.id;
        console.log(req);
        const result = await getDepartment(id);
        console.log(result);
        res.send({
            result: result
        });
    },
    getPosition: async (req, res) => {
        const projID = req.body.projID;
        const deptID = req.body.deptID;

        const result = await getPosition(deptID, projID);

        res.send({
            result: result
        });
    },
    getEmployee: async (req, res) => {
        const id = req.body.emp_id;
        try {
            let result = await getEmployee(id);
            res.send({
                result: result
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            return res.redirect("/employee");
        }
    }
}