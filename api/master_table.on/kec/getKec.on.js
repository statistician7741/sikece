const Kec = require('../../../models/Kec.model');

module.exports = (cb, client, additionalMsg) => {
    Kec.find({}).sort('_id').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}