const { getEmployeeData } = require("./service");
const multer = require("multer");
const path = require("path");
let filePath = "";

const fileFilter = (req, file, cb) => {
    req.fileValidationError = false;
    if (
        file.mimetype.includes("pdf") ||
        file.mimetype.includes("image") ||
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("png") || 
        file.mimetype.includes("word")
    ) {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        cb(null, false, new Error("Please upload only word or pdf file."));
    }
};

let storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const id = req.params.id;
        console.log(id);
        let result;
        try {
            result = await getEmployeeData(id);
        } catch (err) {
            console.log(err);
            cb("An error has been occurred please contact System Admin", false);
        }
        filePath = path.join(__dirname, "../../public/employees/time-off/form/" + result[0].id.toString() + "-" + result[0].first_name.toLocaleLowerCase() + "-" + result[0].last_name.toLocaleLowerCase() + "-" + result[0].father_name.toLocaleLowerCase());
        cb(null, filePath);
    },
    filename: async (req, file, cb) => {
        let date = Date.now();
        const id = req.params.id;
        let result;
        try {
            result = await getEmployeeData(id);
        } catch (err) {
            console.log(err);
            cb("An error has been occurred please contact System Admin", false);
        }
        const projId = result[0].project_id.toString();
        cb(null, `${date}-${projId}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});


const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
