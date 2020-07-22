const Kec = require('../../../models/Kec.model');

module.exports = ({_idKec, _idTable, isApproved, pesanPenyData}, cb, client) => {
    Kec.updateOne({
        _id: _idKec,
        "table._idTable": _idTable
    }, {
        $set: {
            'table.$.approvedDate': new Date(),
            'table.$.isApproved': isApproved,
            'table.$.pesanPenyData': pesanPenyData,
        }
    }, (err, result) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': isApproved?'Berhasil disetujui':'Belum disetujui' })
        }
    })
}