const Table = require('../../../models/Table.model');
const Kec = require('../../../models/Kec.model');
const getTable = require('./getTable.on');
const async = require('async');
const fs = require('fs');

module.exports = (_id, cb, client) => {
    async.auto({
        deleteTableDataFiles: cb_deleteTableDataFiles => {
            Kec.aggregate([
                { $unwind: "$table" },
                {
                    $match: {
                        "table._idTable": _id
                    }
                }
            ]).exec((err, matched_kec) => {
                if (err) {
                    cb_deleteTableDataFiles(err_code.ERROR_ACCESS_DB, null)
                } else {
                    if (matched_kec.length) {
                        matched_kec.forEach(kec => {
                            if (kec.table.arsip.length) {
                                const file_path = __dirname + "/../../../public/static/arsip/";
                                kec.table.arsip.forEach(nama_file => {
                                    if (fs.existsSync(file_path + nama_file)) {
                                        fs.unlinkSync(file_path + nama_file);
                                    }
                                })
                            }
                        })
                        cb_deleteTableDataFiles(null, undefined)
                    } else {
                        cb_deleteTableDataFiles(null, undefined)
                    }
                }
            })
        },
        deleteTableData: ['deleteTableDataFiles', (results, cb_deleteTableData) => {
            Kec.updateMany({},
                { $pull: { table: { _idTable: _id } } },
                (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_deleteTableData(err, null)
                    } else {
                        cb_deleteTableData(null, result)
                    }
                })
        }]
    }, (e, f) => {
        if (e) {
            cb({ 'type': 'error', 'data': e })
        } else {
            Table.deleteOne({ _id }, (err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    client.broadcast.emit('refreshGrafik', {isTable: true, isKec: true});
                    getTable(cb, client)
                }
            })
        }
    })
}