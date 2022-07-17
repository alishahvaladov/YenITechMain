const { getHolidays, addHolidayDate } = require("./service");

module.exports = {
    getHoldiays: async (req, res) => {
        try {
            let offset = req.query.offset;
            if (parseInt(offset) !== 0) {
                offset = parseInt(offset) - 1;
            }
            offset = Math.ceil(parseInt(offset) * 10);
            const result = await getHolidays(offset);

            return res.status(200).send({
                success: true,
                holidays: result.holidays,
                holidayDates: result.holidayDates,
                count: result.count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong"
            });
        }
    },
    addHolidayDate: async (req, res) => {
        try {
            const body = req.body;
            const data = {};

            if (body.holidayStartDate === "" || !body.holidayStartDate) {
                return res.status(400).send({
                    success: false,
                    message: "Please choose holiday start date"
                });
            }

            if (body.holidayEndDate === "" || !body.holidayEndDate) {
                return res.status(400).send({
                    success: false,
                    message: "Please choose holiday end date"
                });
            }

            if (body.holidayID === "" || !body.holidayID || isNaN(parseInt(body.holidayID))) {
                return res.status(400).send({
                    success: false,
                    message: "Please choose holiday"
                });
            } else {
                console.log(body.holidayID);
                data.holiday_id = body.holidayID;
            }

            const holidayStartDate = new Date(body.holidayStartDate);
            const holidayEndDate = new Date(body.holidayEndDate);

            if (holidayStartDate.getTime() > holidayEndDate.getTime()) {
                return res.status(400).send({
                    success: false,
                    message: "Holiday start date cannot be greater than holiday end date"
                });
            }

            let hasError = false;
            for (let i = holidayStartDate; i <= holidayEndDate; i.setDate(i.getDate() + 1)) {
                data.holiday_date = `${i.getFullYear()}-${i.getMonth() + 1}-${i.getDate()}`;
                await addHolidayDate(data, (err, result) => {
                    if (err) {
                        // console.log(err);
                        hasError = true;
                    }
                });
                if (hasError) {
                    return res.status(400).send({
                        success: false,
                        message: "An unknown error has been occurred. Please contact system admin"
                    });
                }
            }

            return res.status(200).send({
                success: true,
                message: "Holidays added"
            });
            
        } catch (err) {
            // console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}