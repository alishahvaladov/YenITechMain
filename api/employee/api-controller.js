const { getDepartment, getPosition } = require("./service");

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
    }
}