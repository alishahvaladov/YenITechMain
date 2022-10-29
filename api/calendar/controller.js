const { getWorkCalendars, updateWorkCalendar, getCalendarByDate } = require("./service");

module.exports = {
    getWorkCalendars: async (req, res) => {
        try {
            const data = req.query;
            const workCalendars = await getWorkCalendars(data);

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
    },
    updateWorkCalendar: async (req, res) => {
        try {
            const body = req.body;

            if (parseInt(body.status) !== 0 && parseInt(body.status) !== 1 && parseInt(body.status) !== 2) {
                return res.status(400).send({
                    success: false,
                    message: "Your attack has been saved and case sent to Police!!!"
                });
            }

            await updateWorkCalendar(body);

            return res.status(201).send({
                success: true,
                message: "Update was successfull"
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getCalendarByDate: async (req, res) => {
        try {
            const {date} = req.query;

            const selectedDate = await getCalendarByDate(date);

            return res.status(200).send({
                success: true,
                selectedDate
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