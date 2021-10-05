// const multer = require("multer");
// const path = require("path");
// let projName = "YH";
//
// const excelFilter = (req, file, cb) => {
//     console.log(file);
//     if (
//         file.mimetype.includes("excel") ||
//         file.mimetype.includes("spreadsheetml")
//     ) {
//         cb(null, true);
//     } else {
//         cb("Please upload only excel file.", false);
//     }
// };
//
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log(file);
//         cb(null, path.join(__dirname, '../../public/uploads/fprints'));
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         console.log(file.originalname);
//         cb(null, `${Date.now()}-${projName}-${file.originalname}`);
//     },
// });
//
// let uploadFile = multer({ storage: storage });
// module.exports = uploadFile;

const multer = require("multer");
const path = require("path");

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + "../../public/uploads/fprints"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + 'YH' + file.originalname);
    }
});

const upload = multer({storage: fileStorageEngine});

module.exports = upload;