const passport = require("passport");
const express = require("express");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const { sequelize } = require("./db_config/models");
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const MySQLStore = require('express-mysql-session')(session);
const { hr } = require("./modules/auth/auth");

const app = express();


const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ytechyhayat20022021',
    database: 'test'
}

const sessionStore = new MySQLStore(options);

app.use(session({
    key: 'name',
    secret: process.env.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


require("./modules/auth/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use('/assets', express.static(path.join(__dirname, './public/assets')));
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));
app.use('/salary-xlsx', express.static(path.join(__dirname, './salaries_xlsx')));

// Initialize Passport

// Set Engine
app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs",
        helpers: {
            compare_if: (val, checker, opts) => {
                if (val == checker) {
                    return opts.fn(this);
                }
            },
        }
    })
);
app.set("view engine", ".hbs");

// Utility Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        let ext = "."+ file.originalname.split(".").slice(-1);
        cb(null, "profile-image" + "-" + Date.now() + ext);
    }
});

var upload = multer({
    storage
});

app.use(upload.single("profile-photo"));




app.use(cors());
app.options('*', cors());




// Global Vars
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

// Import Routers
const timeOffRequest = require("./modules/time-off-request/timeoff.router");
const department = require("./modules/department/department.router");
const userRouter = require("./modules/user/user.router");
const employeeRouter = require("./modules/employee/employee.router");
const project = require("./modules/project/project.router");
const position = require("./modules/position/position.router");
const nofprint = require("./modules/nofprint/nofprint.router");
const salary = require("./modules/salary/salary.router");
const calculate = require("./modules/salary-calculation/router");
const salary_xlsx = require("./modules/upload_salary/router");
const selectFPrint = require("./modules/all-f-print/router");
const fprints = require("./modules/fprints/router");

// Routers
app.use("/", userRouter);
app.use("/employee", employeeRouter);
app.use("/timeoffrequests", timeOffRequest);
app.use("/department", department);
app.use("/projects", project);
app.use("/positions", position);
app.use("/nofprint", nofprint);
app.use("/salaries", salary);
app.use("/calculation", calculate);
app.use("/test", salary_xlsx);
app.get("/select-fprint", selectFPrint);
app.get("/fprints", fprints);

app.get("/not-found", (req, res) => {
    res.render("404");
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on PORT ${port}`));
