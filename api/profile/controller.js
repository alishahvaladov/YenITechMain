const { renderProfile } = require("./service");

module.exports = {
    renderProfile: async (req, res) => {
        const id = req.user.id;

        const profileData = await renderProfile(id);

        res.status(200).json({
            profile: profileData
        });
    }
}