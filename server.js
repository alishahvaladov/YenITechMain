const passport = require("passport");
const express = require("express");
const { engine, create } = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const MySQLStore = require('express-mysql-session')(session);
const { Server } = require("socket.io");
const http = require('http');

const app = express();


const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'yhayatytech20022021',
    database: 'test'
}

const sessionStore = new MySQLStore(options);
const sessionMiddleware = session({
    key: 'name',
    secret: process.env.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
})

app.use(sessionMiddleware);


require("./modules/auth/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use('/assets', express.static(path.join(__dirname, './public/assets')));
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));
app.use('/excels-for-delete', express.static(path.join(__dirname, './public/excels')));
app.use('/salary-xlsx', express.static(path.join(__dirname, './salaries_xlsx')));
app.use('/employee/files', express.static(path.join(__dirname, './public/employees')));
// app.use('/src', express.static(path.join(__dirname, './public/src')));

// Initialize Passport

// Set Engine
const hbs = create({
    extname: ".hbs",
    helpers: {
        compare_if: (val, checker, opts) => {
            if (val == checker) {
                return opts.fn(this);
            }
        },
    },

});
app.engine(
    ".hbs",
    hbs.engine
);
app.set("view engine", ".hbs");

// Utility Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.use(cors());
app.options('*', cors());




// Global Vars
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Import Routers
const timeOffRequest = require("./modules/time-off-request/timeoff.router");
const department = require("./modules/department/department.router");
const userRouter = require("./modules/user/user.router");
const employeeRouter = require("./modules/employee/employee.router");
const project = require("./modules/project/project.router");
const position = require("./modules/position/position.router");
const nofprint = require("./modules/nofprint/nofprint.router");
const noFprintAPI = require("./api/nofprint/api");
const salary = require("./modules/salary/salary.router");
const calculate = require("./modules/salary-calculation/router");
const selectFPrint = require("./modules/all-f-print/router");
const fprints = require("./modules/fprints/router");
const notification = require("./modules/notification/router");
const empAPI = require("./api/employee/employee-api");
const timeOffAPI = require("./api/time-off/api");
const fPrintAPI = require("./api/fprints/api");
const fine = require("./modules/fine/router");
const fineAPI = require("./api/fine/api");
const profile = require("./modules/profile/router");
const deviceManagement = require("./modules/device-management/router");
const profileAPI = require("./api/profile/api");
const salaryAPI = require("./api/salary/api");
const userAPI = require("./api/users/api");
const notificationAPI = require("./api/notifications/api");
const departmentAPI = require('./api/department/api');
const positionAPI = require("./api/position/api");
const projectAPI = require("./api/projects/api");
const workingHoursAPI = require('./api/working-hours/router');
const workingHoursRouter = require('./modules/working-hours/router');
const holidayRouter = require("./modules/holidays/router");
const calendarAPI = require("./api/calendar/api");
const dashboardAPI = require("./api/dashboard/api");
const navbarAPI = require("./api/navbar/api");
const groupRouter = require("./modules/group/router");
const groupAPI = require("./api/group/api");
const deviceManagementAPI = require("./api/device-management/api");
const salaryExcelsApi = require("./api/salary-excels/api");
const vacationAPI = require("./api/vacation/api");
const { createSocketUser, removeSocketUser, sendNotification } = require("./socket/socket");
const { getAllNotifications } = require("./api/notifications/service");
const accessGroupApi = require("./api/access-groups/api");
const accessGroupRouter = require("./modules/access-groups/router");


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
app.use("/all-fprints", selectFPrint);
app.use("/fprints", fprints);
app.use("/fines", fine);
app.use("/profile", profile);
app.use("/working-hours", workingHoursRouter);
app.use("/notification", notification);
app.use("/holidays", holidayRouter);
app.use("/groups", groupRouter);
app.use("/device-management", deviceManagement)
app.use("/api", empAPI);
app.use("/api/time-off", timeOffAPI)
app.use("/api/fprints", fPrintAPI);
app.use("/api/fine", fineAPI);
app.use("/api/nofprints", noFprintAPI);
app.use("/api/profile", profileAPI);
app.use("/api/salary", salaryAPI);
app.use("/api/users", userAPI);
app.use("/api/notification", notificationAPI);
app.use("/api/department", departmentAPI);
app.use("/api/position", positionAPI);
app.use("/api/project", projectAPI);
app.use('/api/working-hours', workingHoursAPI);
app.use('/api/calendar', calendarAPI);
app.use("/api/dashboard", dashboardAPI);
app.use("/api/navbar", navbarAPI);
app.use("/api/groups", groupAPI);
app.use("/api/salary-excels", salaryExcelsApi);
app.use("/api/vacation", vacationAPI);
app.use("/api/devices", deviceManagementAPI);
app.use("/api/access-groups", accessGroupApi);
app.get("/not-found", (req, res) => {
    res.render("404");
});
app.get("/support", (req, res) => {
    return res.render("support");
});

app.get("/ali-shahvaladov", (req, res) => {
    return res.render("ali-shahvaladov");
});

app.get("/mehdi-mammadzada", (req, res) => {
    return res.render("/mehdi-mammadzada");
});
app.use("/access-groups", accessGroupRouter);

const server = http.createServer(app);

const io = require("./socket/socket")
  .init(server)
  .use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

io.on("connection", async (socket) => {
  const userId = socket.request?.session?.passport?.user || null;
  if (!userId) return socket.disconnect();

  createSocketUser(userId, socket.id);
  console.log(`User ${userId} connected: ${socket.id}`);

  let {
    count: [{ count: notificationCount }],
  } = await getAllNotifications({ userId });

  socket.on("disconnect", () => {
    removeSocketUser(userId);
    console.log(`User ${userId} disconnected: ${socket.id}`);
  });

  io.to(socket.id).emit("notification", { notificationCount });

  // ! test for socket connection
  socket.on("msg", (data) => {
    sendNotification([1,2,3], {
        "header": "Salam Dunya", 
        "description": "Hello Ali",
        "created_by": 35,
        "belongs_to": 35,
        "belongs_to_role": 1,
        "url": null,
        "importance": 1
    }, true);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server is running on PORT ${port}`));
