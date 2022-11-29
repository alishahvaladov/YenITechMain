module.exports = {
    renderGroup: (req, res) => {
        return res.render("group/groups");
    },
    renderAddGroup: (req, res) => {
        return res.render("group/add-group");
    },
    renderEditGroup: (req, res) => {
        return res.render("group/edit");
    }
}