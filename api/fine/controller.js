const { 
    getFineData,
    approveEditedFine,
    getFineDataByID,
    deleteFromFine,
    approveFine,
    resetApprovedFine,
    getFinedData,
    insertForgivenData,
    updateFine,
    getAllForgivenData
} = require("./service");


module.exports = {
    getFineData: async (req, res, next) => {
        const role = req.user.role;
        try {
            const fineData = await getFineData(role);
            const result = {};
            result.result = fineData;
            if (req.user.role === 2) {
                result.role = "admin";
            } else {
                result.role = "hr";
            }
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
        const data = {};
        const deleteData = {};
        const fineData = await getFineDataByID(id);
        const totalMinute = fineData[0].minute_total;
        const approvedFines = fineData[0].fine_minute;
        if(parseInt(approvedMinute) > parseInt(totalMinute)) {
            data.fine_minute = parseInt(totalMinute)
        } else {
            data.fine_minute = parseInt(approvedMinute) + parseInt(approvedFines);
        }
        data.id = id;
        deleteData.id = id;
        deleteData.deletedMinute = parseInt(totalMinute) - parseInt(approvedMinute);
        if (parseInt(totalMinute) - parseInt(approvedMinute) < 0) {
            deleteData.deletedMinute = 0;
        }
        approveEditedFine(data, (err, result) => {
           if(err) {
               console.log(err);
               return res.status(500).send({
                   success: false,
                   message: "An unknown error has been occurred"
               });
           }
           deleteFromFine(deleteData, (err, result) => {
               if(err) {
                   console.log(err);
                   return res.status(500).send({
                       success: false,
                       message: "Something went wrong!"
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
        const forgivenData = {};        
        data.id = query.btnValue;
        data.deletedMinute = 0;
        const fineData = await getFineDataByID(data.id);
        console.log(fineData);
        forgivenData.fine_id = data.id;
        deleteFromFine(data, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    error: true,
                    message: "An unknown error has been occurred"
                });
            }
            forgivenData.user_id = req.user.id;
            forgivenData.emp_id = fineData[0].emp_id;
            forgivenData.minute_total = fineData[0].minute_total;
            forgivenData.forgivenData = parseInt(fineData[0].minute_total);
            insertForgivenData(forgivenData, (err, result) => {
                if (err) {
                    console.log(err);
                    updateFine(fineData, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({
                                success: false,
                                message: "Something went wrong!"
                            });
                        }
                        return res.status(500).send({
                            success: false,
                            message: "Something went wrong!"
                        });
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Employee's fine has been reset"
                });
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
        const fineData = await getFineDataByID(id);
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
    },
    getFinedData: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await getFinedData(id);

            return res.status(200).json({
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: "An unknown error has been occurred"
            });
        }
    },
    getAllForgivenData: async (req, res) => {
        try {
            let offset = req.params.offset;
            offset = parseInt(offset) * 15;
            const result = await getAllForgivenData(offset);
            console.log(result);
            
            return res.status(200).send({
                success: true,
                result
            });
        } catch(err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong"
            });
        }
    }
}