const { getDevices, addDevices, getDeviceById, updateDevice, deleteDevice } = require("./service");

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

            const { name, specs } = req.body;

            if (!name || name === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please insert device name"
                });
            }

            if (!specs || specs.length < 1 || specs === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please provide at least one specification"
                });
            }

            if (Object.keys(req.body)[0] !== "name") {
                return res.status(400).send({
                    success: false,
                    message: "Please check reliability of data"
                });
            }

            if (Object.keys(req.body)[1] !== "specs") {
                return res.status(400).send({
                    success: false,
                    message: "Please check reliability of data"
                });
            }

            for (const value of Object.values(specs)) {
                if (typeof(value) === "object") {
                    return res.status(400).send({
                        success: false,
                        message: "Please provide valid data structure"
                    });
                }
            }

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
            const data = {};

            const { name, specs } = req.body;
            const { id } = req.query;
            if (!name || name === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please insert device name"
                });
            }

            if (!specs || specs.length < 1 || specs === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please provide at least one specification"
                });
            }

            if (Object.keys(req.body)[0] !== "name") {
                return res.status(400).send({
                    success: false,
                    message: "Please check reliability of data"
                });
            }

            if (Object.keys(req.body)[1] !== "specs") {
                return res.status(400).send({
                    success: false,
                    message: "Please check reliability of data"
                });
            }

            for (const value of Object.values(specs)) {
                if (typeof(value) === "object") {
                    return res.status(400).send({
                        success: false,
                        message: "Please provide valid data structure"
                    });
                }
            }

            data.id = id;
            data.json_string = JSON.stringify(req.body);

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
    },
    getDevicesByID: async (req, res) => {
        try {
            const { id } = req.query;

            const device = await getDeviceById(id);

            if (device.length < 1) {
                return res.status(400).send({
                    success: false,
                    message: "This device cannot found"
                });
            }

            return res.status(200).send({
                success: true,
                device
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    deleteDevice: (req, res) => {
        try {
            const { id } = req.query;

            if (!id || id === "") {
                return res.status(400).send({
                    success: false,
                    message: "Please choose device to delete"
                });
            }

            deleteDevice(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        success: false,
                        message: "This device not found please try again"
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Device has been deleted"
                });
            })
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}