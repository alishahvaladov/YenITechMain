let links = require("./links.json");

module.exports = {
    hrAccess: () => {

        return links.hr;
    },
    sAdminAccess: () => {

        return links.sAdmin
    }
}
