const Bab = require('../../../models/Bab.model');

module.exports = (tahun_buku, cb, client, additionalMsg) => {
    Bab.find({tahun_buku}).sort('_id').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}