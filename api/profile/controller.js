const db = require("../../db_config/models");
const { renderProfile, getProfilePicture } = require("./service");

module.exports = {
    renderProfile: async (req, res) => {
        try {
            const id = req.user.id;
            const profileData = await renderProfile(id);
            return res.status(200).json({
                profile: profileData
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Something went wrong"
            });
        }
    },
    getProfilePicture: async (req, res) => {
        const id = req.user.id;
        try {
            const result = await getProfilePicture(id);
            let uploadedFiles = result[0].uploaded_files;
            uploadedFiles = JSON.parse(uploadedFiles);
            uploadedFiles = JSON.parse(uploadedFiles.recruitment);
            const filename = `/employee/files/recruitment/${result[0].id}-${result[0].first_name.toLowerCase()}-${result[0].last_name.toLowerCase()}-${result[0].father_name.toLowerCase()}/${uploadedFiles.profilePicture[0].filename}`;
            return res.status(200).send({
                filename
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "An unkown error has been occurred"
            });
        }
    }
}