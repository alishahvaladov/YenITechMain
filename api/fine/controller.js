const { getFineData, approveEditedFine, getFineDataByID, deleteFromFine, approveFine, resetApprovedFine} = require("./service");

module.exports = {
    getFineData: async (req, res, next) => {
        try {
            const result = await getFineData();
            return res.send(result);
        } catch (err) {
            req.flash("error_msg", "An unknown error has been occurred");
        }
    },
    approveEditedFine: async (req, res) => {
        const params = req.query;
        const id = params.btnValue;
        let approvedMinute = parseInt(params.minute);
        if(approvedMinute < 0) {
            approvedMinute = 0;
        }
        console.log(approvedMinute);
        const data = {};
        const deleteData = {};
        const fineData = await getFineDataByID(id);
        console.log(fineData);
        const totalMinute = fineData[0].minute_total;
        const approvedFines = fineData[0].fine_minute;
        if(parseInt(approvedMinute) > parseInt(totalMinute) - 30 && parseInt(totalMinute) - 30 > 0) {
            data.fine_minute = parseInt(totalMinute) - 30
        } else if (parseInt(approvedMinute) > parseInt(totalMinute) - 30 && parseInt(totalMinute) - 30 < 1) {
            data.fine_minute = parseInt(approvedFines);
        } else {
            data.fine_minute = parseInt(approvedMinute) + parseInt(approvedFines);
        }
        data.id = id;
        deleteData.id = id;
        deleteData.deletedMinute = parseInt(totalMinute) - parseInt(approvedMinute);
        if (parseInt(totalMinute) - parseInt(approvedMinute) < 0) {
            deleteData.deletedMinute = 0;
        }
        console.log(data);
        approveEditedFine(data, (err, result) => {
           if(err) {
               console.log(err);
               return res.status(500).send({
                   error: true,
                   message: "An unknown error has been occurred"
               });
           }
           deleteFromFine(deleteData, (err, result) => {
               if(err) {
                   return res.status(500).send({
                       error: true,
                       message: "Approved minute couldn't delete from database please try system admin"
                   });
               }
           })
           return res.status(200).send({
               success: true
           });
        });
    },
    resetFine: async (req, res) => {
        const query = req.query;
        const data = {};
        data.id = query.btnValue;
        data.deletedMinute = 0;
        deleteFromFine(data, (err, result) => {
            if (err) {
                return res.status(500).send({
                    error: true,
                    message: "An unknown error has been occurred"
                });
            }
            return res.status(200).send({
                success: true,
                message: "Employee's fine has been reset"
            });
        });
    },
    approveFine: async (req, res) => {
        const query = req.query;
        const data = {};
        const id = query.btnValue;
        const fineData = await getFineDataByID(id);
        const fineMinute = fineData[0].fine_minute;
        let minuteTotal = parseInt(fineData[0].minute_total);
        if(minuteTotal - 30 < 0) {
            minuteTotal = 0
        } else {
            minuteTotal -= 30;
        }
        data.id = id;
        data.fine_minute = minuteTotal + parseInt(fineMinute);
        approveFine(data, (err, result) => {
           if(err) {
               console.log(err);
               return res.status(500).send({
                   error: true,
                   message: "An unknown error has been occurred"
               });
           }
           return res.status(200).send({
               success: true,
               message: "An employee has been fined successfully"
           });
        });
    },
    resetApprovedFine: async (req, res) => {
        const data = {};
        const { id } = req.params;
        console.log(id);
        const fineData = await getFineDataByID(id);
        console.log(fineData);
        data.id = id;
        const minute_total = fineData[0].minute_total;
        data.minute_total = parseInt(minute_total) + parseInt(fineData[0].fine_minute);
        resetApprovedFine(data, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: "Unknown error has been occurred"
                });
            }
            return res.status(204).send("Approved fine has been reset");
        })
    }
}