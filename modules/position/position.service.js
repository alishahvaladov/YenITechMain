const { Position } = require("../../db_config/models");

module.exports = {
    addPosition: (data, cb) => {
        Position.create({
            user_id: data.user_id,
            name: data.name
        }, {
            logging: false
        }).then((position) => {
            console.log(position);
            cb()
        }).catch((err) => {
            cb(err);
        })
    },
    getPositions: (cb) => {
        Position.findAll({
            logging: false
        }).then((results) => {
            cb(null, results);
        }).catch((err) => {
            cb(err);
        })
    },
    deletePosition: (id, cb) => {
        Position.destroy({
            where: {
                id: id
            },
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    getPosition: (id, cb) => {
        Position.findOne({
            where: {
                id: id
            },
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    updatePosition: (id, data, cb) => {
        Position.update({
            name: data.name
        }, {
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    }
}