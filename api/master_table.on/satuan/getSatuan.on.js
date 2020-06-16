const Satuan = require('../../../models/Satuan.model');

module.exports = (cb, client, additionalMsg) => {
    Satuan.find({}).sort('_id').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}