const { getDevices, addDevices, getDeviceById, updateDevice } = require("./service");

module.exports = {
    getDevices: async (req, res) => {
        try {
            const data = req.query;

            data.offset = parseInt(data.offset) * 15;

            const result = await getDevices(data);

            return res.status(200).send({
                success: true,
                count: result.count[0].count,
                devices: result.devices
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    addDevices: (req, res) => {
        try {
            const body = {};
            body.json_string = JSON.stringify(req.body);

            addDevices(body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups... Something went wrong"
                    });
                }
                
                return res.status(200).send({
                    success: true,
                });
            })
            

        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    updateDevice: async (req, res) => {
        try {
            const body = JSON.stringify(req.body);
            const { id } = req.query;
            const data = {};

            data.id = id;
            data.json_string = body;

            updateDevice(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups... Something went wrong!"
                    });
                }
                return res.status(200).send({
                    success: true
                });
            });

        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}