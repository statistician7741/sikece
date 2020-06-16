const Kab = require('../../../models/Kab.model');
const getKab = require('./getKab.on');

module.exports = (_id, cb, client) => {
    Kab.deleteOne({_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getKab(cb,client)
        }
    })
}