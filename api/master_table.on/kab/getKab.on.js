const Kab = require('../../../models/Kab.model');

module.exports = (cb, client, additionalMsg) => {
    Kab.find({}).sort('_id').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}