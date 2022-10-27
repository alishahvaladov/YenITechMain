const { getWorkCalendars } = require("./service");

module.exports = {
    getWorkCalendars: async (req, res) => {
        try {
            const body = req.body;
            const workCalendars = await getWorkCalendars(body);

            return res.status(200).send({
                success: true,
                calendar: workCalendars
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