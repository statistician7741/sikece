const Bab = require('../../../models/Bab.model');

module.exports = (cb, client) => {
    Bab.find({}).distinct('tahun_buku').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result })
        }
    })
}