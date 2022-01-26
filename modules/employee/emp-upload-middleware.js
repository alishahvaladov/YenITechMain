const { checkIfEmpExists, getEmpProjName } = require("./employee.service");
const multer = require("multer");
const path = require("path");
let filePath = "";

const fileFilter = (req, file, cb) => {
    if( file.fieldname === "frScan" && file.mimetype === "pdf" ||
        file.fieldname === "frScan" && file.mimetype === "image" ||
        file.fieldname === "frScan" && file.mimetype === "jpg" ||
        file.fieldname === "frScan" && file.mimetype === "jpeg")
    {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        req.fileValidationMessage = "Tam Maddi-Məsuliyyət müqaviləsinin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
        cb(null, false, new Error("Please upload only word or pdf file."));
    }

    if( file.fieldname === "pcScan" && file.mimetype === "pdf" ||
        file.fieldname === "pcScan" && file.mimetype === "image" ||
        file.fieldname === "pcScan" && file.mimetype === "jpg" ||
        file.fieldname === "pcScan" && file.mimetype === "jpeg")
    {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        req.fileValidationMessage = "Məxfi Məlumatların Qorunması müqaviləsinin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
        cb(null, false, new Error("Please upload only word or pdf file."));
    }

    if( file.fieldname === "hcScan" && file.mimetype === "pdf" ||
        file.fieldname === "hcScan" && file.mimetype === "image" ||
        file.fieldname === "hcScan" && file.mimetype === "jpg" ||
        file.fieldname === "hcScan" && file.mimetype === "jpeg")
    {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        req.fileValidationMessage = "Sağlamlıq Haqqında arayışın yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
        cb(null, false, new Error("Please upload only word or pdf file."));
    }

    if( file.fieldname === "injScan" && file.mimetype === "pdf" ||
        file.fieldname === "injScan" && file.mimetype === "image" ||
        file.fieldname === "injScan" && file.mimetype === "jpg" ||
        file.fieldname === "injScan" && file.mimetype === "jpeg")
    {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        req.fileValidationMessage = "Əmrin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
        cb(null, false, new Error("Please upload only word or pdf file."));
    }

    if( file.fieldname === "diplomaScan" && file.mimetype === "pdf" ||
        file.fieldname === "diplomaScan" && file.mimetype === "image" ||
        file.fieldname === "diplomaScan" && file.mimetype === "jpg" ||
        file.fieldname === "diplomaScan" && file.mimetype === "jpeg")
    {
        cb(null, true);
    } else {
        req.fileValidationError = true;
        req.fileValidationMessage = "Əmrin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
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
