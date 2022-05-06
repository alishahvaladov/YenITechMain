const config = require('../../config/config.json');
const { 
    renderProfile, 
    getProfilePicture, 
    getUserDataAsEmployee, 
    addTimeOff 
} = require("./service");

module.exports = {
    renderProfile: async (req, res) => {
        try {
            const id = req.user.id;
            const profileData = await renderProfile(id);
            return res.status(200).json({
                profile: profileData
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Something went wrong"
            });
        }
    },
    getProfilePicture: async (req, res) => {
        const id = req.user.id;
        try {
            const result = await getProfilePicture(id);
            let uploadedFiles = result[0].uploaded_files;
            uploadedFiles = JSON.parse(uploadedFiles);
            uploadedFiles = JSON.parse(uploadedFiles.recruitment);
            const filename = `/employee/files/recruitment/${result[0].id}-${result[0].first_name.toLowerCase()}-${result[0].last_name.toLowerCase()}-${result[0].father_name.toLowerCase()}/${uploadedFiles.profilePicture[0].filename}`;
            return res.status(200).send({
                filename
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    },
    getUserDataAsEmployee: async (req, res) => {
        try {
            const user_id = req.user.id;
            const employee = await getUserDataAsEmployee(user_id);
            
            return res.status(200).send({
                success: true,
                employee
            });
        } catch(err) {
            console.log(err);
            return res.status(404).send({
                success: false,
                message: "This employee couldn't find please contact system admin!"
            });
        }   
    },
    addTimeOff: async (req, res) => {
        try {
            const timeOffTypes = config.day_offs;
            const body = req.body;
            let timeOffTypeValidation = false;
            if (parseInt(body.timeOffType) === 4) {
                body.timeOffStartDate = null;
                body.timeOffEndDate = null
                body.wStartDate = null

                if (body.toffTime === "" || !body.toffTime) {
                    return res.status(400).send({
                        success: false,
                        message: "Please fill time off time field"
                    });
                }

                if (body.toffTimeDate === "" || !body.toffTimeDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please fill date for time off time field"
                    });
                }
            } else {
                if (body.timeOffType === "" || !body.timeOffType) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose timeOffType"
                    });
                } else {
                    body.toffTime = null;
                    body.toffTimeDate = null;
                    for (const [key, value] in Object.entries(timeOffTypes)) {
                        if(parseInt(body.timeOffType) === parseInt(key)) {
                            return timeOffTypeValidation = true;
                        } 
                    }
                }
                if (!timeOffTypeValidation) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose correct time off type"
                    });
                }
    
                if (body.timeOffStartDate === "" || !body.timeOffStartDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose time off start date"
                    });
                }
                if (body.timeOffEndDate === "" || !body.timeOffEndDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose time off end date"
                    });
                }
    
                const toffStartDate = new Date(body.timeOffStartDate);
                const toffEndDate = new Date(body.timeOffEndDate);
    
                if (toffStartDate.getTime() > toffEndDate.getTime()) {
                    return res.status(400).send({
                        success: false,
                        message: "Time off start date cannot be greater than time off end date"
                    });
                }
                
                if (body.wStartDate === "" || !body.wStartDate) {
                    return res.status(400).send({
                        success: false,
                        message: "Please select work start date"
                    });
                }
    
                const dateOptions = new Date();
                const wStartDate = new Date(body.wStartDate);
                
                dateOptions.setDate(toffEndDate.getDate() + 1);
    
                if (wStartDate.getTime() > dateOptions.getTime() || wStartDate.getTime() < toffEndDate.getTime()) {
                    return res.status(400).send({
                        success: false,
                        message: "Please choose correct work start date"
                    });
                }
            }

            const user_id = req.user.id;
            const employee = await getUserDataAsEmployee(user_id);
            body.user_id = user_id;
            body.emp_id = employee.id;

            addTimeOff(body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups.. Something went wrong!"
                    });
                }
                return res.status(204);
            });


        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups.. Something went wrong!"
            });
        }
    }
}