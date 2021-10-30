const multer = require("multer");
const path = require("path");
const projName = "YH";

const excelFilter = (req, file, cb) => {
    if ( path.extname(file.originalname) === ".xlsx") {
        cb(null, true);
    } else {
        cb("Please upload only xlsx file.", false);
    }
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, path.join(__dirname, '../../public/uploads/fprints'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        console.log(file.originalname);
        cb(null, `${Date.now()}-${projName}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage, fileFilter: excelFilter});

module.exports = upload;