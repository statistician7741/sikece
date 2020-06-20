const Deskel = require('../../../models/Deskel.model');
const getDeskel = require('./getDeskel.on');

module.exports = (_id, cb, client) => {
    Deskel.deleteOne({_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getDeskel(cb,client)
        }
    })
}