const { searchFPrint, renderForgottenFPrints, updateForgottenFPrints, getForgottenFPrintById, createFPrintForForgottenFPrint } = require("./service");

module.exports = {
    searchFPrint: async (req, res) => {
        try {
            const data = req.body;
            let result = await searchFPrint(data);

            res.send({
                result
            });
        } catch (e) {
            req.flash("error_msg", "An unkown error has been occurred");
            return res.redirect("/fprints");
        }
    },
    renderFPrints: async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            let fPrints = await searchFPrint(req.body);
            res.send({
                fPrints
            })
        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    getFPrintsByPage: async (req, res) => {
        const data = req.body;
        try {
            let fPrints = await searchFPrint(data);
            res.send({
                fPrints
            });

        } catch (err) {
            console.log(err);
            res.send({
                err: "An unknown error has been occurred",
                status: res.status
            });
        }
    },
    renderForgottenFPrints: async (req, res) => {
        try { 
            const result = await renderForgottenFPrints();
            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: true,
                message: "An unknown error has been occurred"
            });
        }
    },
    updateForgottenFPrints: async (req, res) => {
        const query = req.query;
        const id = query.btnValue;
        const data = {};
        const fPrintData = {};
        const time = query.time;
        const entrance = (query.entrance === 'true');
        const exit = (query.exit === 'true');
        const forgottenData = await getForgottenFPrintById(id);
        if(forgottenData[0].f_print_time_entrance !== null && forgottenData[0].f_print_time_exit !== null) {
            return res.status(403).json({
                success: false,
                message: "This user's entrance and exit already exist"
            });
        }

        if(entrance === true) {
            fPrintData.emp_id = forgottenData[0].emp_id;
            fPrintData.user_id = req.user.id;
            fPrintData.f_print_date = forgottenData[0].f_print_date;
            fPrintData.f_print_time = time;
            createFPrintForForgottenFPrint(fPrintData, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    })
                }
            });
            data.id = id;
            data.f_print_time_entrance = time;
            data.f_print_time_exit = forgottenData[0].f_print_time_exit;
            updateForgottenFPrints(data, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
            });
        } else if (exit === true) {
            fPrintData.emp_id = forgottenData[0].emp_id;
            fPrintData.user_id = req.user.id;
            fPrintData.f_print_date = forgottenData[0].f_print_date;
            fPrintData.f_print_time = time;
            data.id = id;
            data.f_print_time_entrance = forgottenData[0].f_print_time_entrance;
            data.f_print_time_exit = time;
            createFPrintForForgottenFPrint(fPrintData, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    })
                }
            });
            updateForgottenFPrints(data, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Unknown error has been occurred"
                    });
                }
            });
        }

    }
}