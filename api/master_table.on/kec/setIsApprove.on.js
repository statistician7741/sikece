const Kec = require('../../../models/Kec.model');

module.exports = ({_idKec, _idTable, isApproved}, cb, client) => {
    Kec.updateOne({
        _id: _idKec,
        "table._idTable": _idTable
    }, {
        $set: {
            'table.$.isApproved': isApproved,
        }
    }, (err, result) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': isApproved?'Berhasil disetujui':'Belum disetujui' })
        }
    })
}