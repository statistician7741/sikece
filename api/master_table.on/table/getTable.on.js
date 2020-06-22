const Table = require('../../../models/Table.model');

module.exports = (cb, client, additionalMsg) => {
    Table.find({}).sort('nomor_tabel').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}