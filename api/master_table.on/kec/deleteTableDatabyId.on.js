const Kec = require('../../../models/Kec.model');
const async = require('async');
const err_code = require('../../../error/code.error')
const fs = require('fs');

module.exports = ({ _idKec, _idTable }, cb, client) => {
    async.auto({
        deleteArsip: cb_deleteArsip => {
            Kec.aggregate([
                { $unwind: "$table" },
                {
                    $match: {
                        "_id": _idKec,
                        "table._idTable": _idTable
                    }
                }
            ]).exec((err, matched_kec) => {
                if (err) {
                    cb_deleteArsip(err_code.ERROR_ACCESS_DB, null)
                } else {
                    if (matched_kec[0]) {
                        if (matched_kec[0].table.arsip.length) {
                            const file_path = __dirname + "/../../../public/static/arsip/";
                            matched_kec[0].table.arsip.forEach(nama_file => {
                                if (fs.existsSync(file_path + nama_file)) {
                                    fs.unlinkSync(file_path + nama_file);
                                }
                            })
                            cb_deleteArsip(null, undefined)
                        } else {
                            cb_deleteArsip(null, undefined)
                        }
                    } else {
                        cb_deleteArsip(null, undefined)
                    }
                }
            })
        }
    }, (err, { deleteArsip }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            Kec.updateOne({ _id: _idKec },
                { $pull: { table: { _idTable } } },
                (err, result) => {
                    if (err) {
                        console.log(err);
                        cb({ 'type': 'error', 'data': err })
                    } else {
                        client.broadcast.emit('refreshGrafik', {isKec: true});
                        cb({ 'type': 'ok', 'data': 'Isi tabel berhasil dihapus.' })
                    }
                })
        }
    })
}