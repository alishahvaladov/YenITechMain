const { checkIfEmpExists, getEmpProjName } = require("./employee.service");
const multer = require("multer");
const path = require("path");
let filePath = "";

const fileFilter = (req, file, cb) => {
    // console.log(file.fieldname);
    if (file.fieldname === "frScan") {
        if( file.mimetype.includes("pdf") ||
            file.mimetype.includes("image")  ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes)
        {
            cb(null, true);
        } else {
            console.log("frScan error");
            req.fileValidationError = true;
            req.fileValidationMessage = "Tam Maddi-Məsuliyyət müqaviləsinin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else if (file.fieldname === "pcScan") {
        if( file.mimetype.includes("pdf") ||
            file.mimetype.includes("image") ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes("jpeg"))
        {
            cb(null, true);
        } else {
            console.log("pcScan error");
            req.fileValidationError = true;
            req.fileValidationMessage = "Məxfi Məlumatların Qorunması müqaviləsinin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else if (file.fieldname === "hcScan") {
        if( file.mimetype.includes("pdf") ||
            file.mimetype.includes("image") ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes("jpeg"))
        {
            cb(null, true);
        } else {
            req.fileValidationError = true;
            req.fileValidationMessage = "Sağlamlıq Haqqında arayışın yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else if (file.fieldname === "injScan") {
        if( file.mimetype.includes("pdf") ||
            file.mimetype.includes("image") ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes("jpeg"))
        {
            cb(null, true);
        } else {
            req.fileValidationError = true;
            req.fileValidationMessage = "Əmrin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else if (file.fieldname === "diplomaScan") {
        if( file.mimetype.includes("pdf") ||
            file.mimetype.includes("image") ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes("jpeg"))
        {
            cb(null, true);
        } else {
            req.fileValidationError = true;
            req.fileValidationMessage = "Əmrin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else if (file.fieldname === "profile-picture") {
        console.log(file);
        if( file.mimetype.includes("png") ||
            file.mimetype.includes("image") ||
            file.mimetype.includes("jpg") ||
            file.mimetype.includes("jpeg"))
        {
            cb(null, true);
        } else {
            req.fileValidationError = true;
            req.fileValidationMessage = "Şəklin yükləndiyindən və ya düzgün fayl formatının daxil olduğundan əmin olun";
            cb(null, false, new Error("Please upload only word or pdf file."));
        }
    } else {
        cb(null, true);
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
