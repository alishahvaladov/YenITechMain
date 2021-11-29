const { checkIfEmpExists, getEmpProjName } = require("./employee.service");
const multer = require("multer");
const path = require("path");
let filePath = "";

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("pdf") ||
        file.mimetype.includes("image") ||
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("jpg") ||
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
        const id = req.params.id;
        checkIfEmpExists(id, (err, res) => {
            if (err) {
                console.log(err);
                req.fileUploadError = true;
                cb(null, false, new Error("An unknown error has been occurred."));
            }
            const result = res.dataValues;
            filePath = path.join(__dirname, `../../public/employees/recruitment/${result.id}-${result.first_name}-${result.last_name}-${result.father_name}`);
            cb(null, filePath);
        })

    },
    filename: async (req, file, cb) => {
        const id = req.params.id;
        let date = Date.now();
        checkIfEmpExists(id, (err, res) => {
            if (err) {
                console.log(err);
                req.fileUploadError = true;
                cb(null, false, new Error("An unknown error has been occurred."));
            }
            const projId = res.dataValues.project_id;
            cb(null, `${date}-${projId}-${file.fieldname}${path.extname(file.originalname)}`);
        })
    },
});


const upload = multer({ storage: storage, fileFilter: fileFilter});

module.exports = upload;
