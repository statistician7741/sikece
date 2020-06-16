const Bab = require('../../../models/Bab.model');
const getBab = require('./getBab.on');

module.exports = ({_id, tahun_buku}, cb, client) => {
    Bab.deleteOne({_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getBab(tahun_buku,cb,client)
        }
    })
}