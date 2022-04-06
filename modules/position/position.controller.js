const { addPosition, getPositions, deletePosition, getPosition, updatePosition } = require("./position.service");
const { Position } = require("../../db_config/models");
const {Op} = require("sequelize");
let errors = [];

module.exports = {
    addPosition: (req, res) => {
        errors = [];
        const data = req.body;
        data.user_id = req.user.id;
        if((/[a-zA-ZşŞəƏüÜöÖğĞçÇıI]/).test(data.name) === false) {
            req.flash("error_msg", "Position cannot contain symbol");
            return res.redirect("/positions/add-position");
        }
        let seperatedName = data.name.split("");
        if (seperatedName.length < 3) {
            req.flash("error_msg", "Position must be at least 3 letter long");
            return res.redirect("/positions/add-position");
        }
        for(let i = 0; i < seperatedName.length; i++) {
            if(!isNaN(parseInt(seperatedName[i]))) {
                req.flash("error_msg", "Position cannot contain number");
                return res.redirect("/positions/add-position");
                break;
            }
        }

        Position.findOne({
            where: {
                name: data.name
            }
        }).then((position) => {
            if(position) {
                errors.push({msg: "This position already exists"});
                if(req.user.role === 1) {
                    return res.render("position/add-position", {
                        errors,
                        super_admin: true
                    });
                } else if (req.user.role === 5) {
                    return res.render("position/add-position", {
                        errors,
                        hr: true
                    });
                }
            }
            if(errors.length === 0) {
                addPosition(data, (err, results) => {
                    if(err) {
                        console.log(err);
                        req.flash("error_msg", "An unknown error occurred please contact System Administrator");
                        return res.redirect("/positions/add-position");
                    }
                    req.flash("success_msg", "Position has been uploaded successfully")
                    return res.redirect("/positions/add-position");
                });
            }
        })
    },
    getPositions: (req, res) => {
        getPositions((err, results) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                return res.redirect("/positions")
            }
            if(req.user.role === 5) {
                res.render("position/positions", {
                    positions: results,
                    hr: true
                });
            } else if (req.user.role === 1) {
                res.render("position/positions", {
                    positions: results,
                    super_admin: true
                });
            }
        })
    },
    deletePosition: (req, res) => {
        const id = req.params.id;
        deletePosition(id, (err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                return res.redirect("/positions");
            }
            console.log(result);
            req.flash("success_msg", "The position have been removed");
            return res.redirect("/positions");
        });
    },
    getPosition: (req, res) => {
        const id = req.params.id;
        getPosition(id, (err, result) => {
           if(err) {
               console.log(err);
               req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
               return res.redirect("/positions");
           }
           console.log(result);
           if(req.user.role === 5) {
               res.render("position/update", {
                   position: result,
                   hr: true
               });
           } else if (req.user.role === 1) {
                res.render("position/update", {
                    position: result.dataValues,
                    super_admin: true
                });
           }
        });
    },
    updatePosition: (req, res) => {
        const id = req.params.id;
        const data = req.body;

        Position.findOne({
            where: {
                name: data.name,
                id: {
                    [Op.ne]: id
                }
            }
        }).then((result) => {
            if(result) {
                console.log(result);
                req.flash("error_msg", "This position already exists please try other name");
                return res.redirect("/positions/update/" + id);
            }
            updatePosition(id, data, (err, result) => {
               if (err) {
                   console.log(err);
                   req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                   return res.redirect("/positions/update/" + id);
               }
               console.log(result);
                req.flash("success_msg", "Position has been updated");
                return res.redirect("/positions/update/" + id);
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
            return res.redirect("/positions/update/" + id);
        })
    }
}