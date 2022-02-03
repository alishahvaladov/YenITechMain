const { getDepartment, getPosition, getEmployee, empRenderPage, getEmpCount, empRenderByPage } = require("./service");

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
    },
    empRenderPage: async (req, res) => {
        try {
            let body = req.body;
            console.log(body);
            let result = await empRenderPage(body);
            let role = '';
            if(req.user.role === 1) {
                role = 'super_admin'
            } else if (req.user.role === 5) {
                role = 'hr';
            }
            return res.send({
                result: result.result,
                count: result.count, 
                role
            });
        } catch (err) {
            console.log(err);
            return res.send({
                error: "An unknown error has been occurred"
            })
        }
    },
    empRenderByPage: async (req, res) => {
        try {
            const body = req.body;
            let role = req.user.role;
            if (role === 5) {
                role = "hr";
            } else if (role === 1) {
                role = "super_admin"
            }
            let offset = req.body.offset;
            offset = (offset - 1) * 10;
            let result = await empRenderByPage(offset, body);
            res.send({
                result,
                role
            });
        } catch (e) {
            console.log(e);
            req.flash("error_msg", "An unknown error has been occurred");
            return res.redirect("/employees");
        }
    }
}