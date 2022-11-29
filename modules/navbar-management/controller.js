module.exports = {
    renderMainPage: (req, res) => {
        return res.render("navbar-management/main");
    },
    renderEditPage: (req, res) => {
        return res.render("navbar-management/edit");
    }
}