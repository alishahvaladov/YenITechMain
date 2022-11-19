const { addGroup, getDepartmentsForGroups, getGroups } = require("./service");

module.exports = {
    addGroup: (req, res) => {
        try {
            const body = req.body;
            body.user_id = req.user.id;

            if (!body.name || body.name === "") {
                return res.status(400).send({
                    success: false,
                    message: "Zəhmət olmasa şöbə adını daxil edin."
                });
            }

            addGroup(body, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups... Something went wrong!"
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Şöbə əlavə edildi"
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
    getDepartmentsForGroups: async (req, res) => {
        try {
            const departments = await getDepartmentsForGroups();

            return res.status(200).send({
                departments
            });

        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getGroups: async (req, res) => {
        try {
            let { offset, qName } = req.query;

            const data = {};

            if (isNaN(parseInt(offset)) || offset === "") {
                return res.status(400).send({
                    success: false,
                    message: "Offset is not defined or not a number"
                });
            }

            if (qName && qName !== "") {
                data.qName = qName;
            }

            data.offset = parseInt(offset) * 15;

            const groups = await getGroups(data);

            return res.status(200).send({
                success: true,
                groups
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}