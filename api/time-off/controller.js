const { getEmpInfo, getTimeOffs, addTimeOff } = require("./service");

module.exports = {
    getEmpInfo: async (req, res) => {
        const id = req.body.id;
        const result = await getEmpInfo(id);

        res.send({
            result
        })
    },
    getTimeOffs: async (req, res) => {
        const timeOffs = await getTimeOffs();
        res.status(200).send({
            timeOffs
        });
    },
    addTimeOff: async (req, res) => {
        const body = req.body;
        if(body.emp === "" || parseInt(body.emp) === 0 || body.timeOffStartDate === "" || body.timeOffEndDate === "" || body.timeOffType === "" || body.wStartDate === "") {
            return res.status(400).send({
                success: false,
                message: "Missing requirements"
            });
        }
        console.log(body);
        addTimeOff(body, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(520).send({
                    success: false,
                    message: "An unknown error has been occurred"
                });
            }
            console.log("Time Off Request Added");
            return res.status(200).send({
                success: true
            });
        });



    }
}