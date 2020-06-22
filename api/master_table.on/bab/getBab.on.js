const Bab = require('../../../models/Bab.model');

module.exports = (cb, client, additionalMsg) => {
    Bab.find({}).sort('nomor').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}