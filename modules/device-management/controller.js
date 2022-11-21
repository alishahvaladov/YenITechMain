module.exports = {
    renderDeviceManagement: (req, res) => {
        return res.render("device-management/main");
    },
    renderDeviceAddPage: (req, res) => {
        return res.render("device-management/add");
    }
}