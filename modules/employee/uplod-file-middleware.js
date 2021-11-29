const { getEmployeeRemoveModule } = require("./employee.service");
const multer = require("multer");
const path = require("path");
let filePath = "";

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("pdf") ||
        file.mimetype.includes("image") ||
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("png")
    ) {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        cb(null, false, new Error("Please upload only word or pdf file."));
    }
};

let storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        console.log("Emp data");
        console.log(req.body.emp);
        const id = req.params.id;
        let result;
        try {
            result = await getEmployeeRemoveModule(id);
        } catch (err) {
            console.log(err);
            cb("An error has been occurred please contact System Admin", false);
        }
        filePath = path.join(__dirname, "../../public/employees/resignations/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
        cb(null, filePath);
    },
    filename: async (req, file, cb) => {
        let date = Date.now();
        const id = req.params.id;
        console.log(file.originalname);
        let result;
        try {
            result = await getEmployeeRemoveModule(id);
        } catch (err) {
            console.log(err);
            cb("An error has been occurred please contact System Admin", false);
        }
        const projId = result[0].project_id.toString();
        console.log(file);
        cb(null, `${date}-${projId}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});


const upload = multer({ storage: storage, fileFilter: fileFilter});

module.exports = upload;
