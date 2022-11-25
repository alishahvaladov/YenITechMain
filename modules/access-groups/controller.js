module.exports = {
    renderAccessGroupsPage: (req, res) => {
        return res.render("access-groups/main");
    },
    renderAccessGroupsAddPage: (req, res) => {
        return res.render("access-groups/add");
    },
    renderAccessGroupUpdatePage: (req, res) => {
        return res.render("access-groups/update");
    }
}