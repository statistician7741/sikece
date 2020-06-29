const Kec = require('../../../models/Kec.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const fs = require('fs');

module.exports = (input, cb, client) => {
    const { _idKec, _idKab, _idTable, sumber, catatan, ket, all_data, fileToKeep, fileToDelete, needFenomena, needFenomenaQ } = input
    async.auto({
        isExist: cb_isExist => {
            Kec.findOne({
                _id: _idKec,
                'table._idTable': _idTable
            }, (err, result) => {
                if (err) {
                    cb_isExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isExist(null, result)
                }
            })
        },
        createTable: ['isExist', (results, cb_createTable) => {
            if (!results.isExist) {
                Kec.updateOne({
                    _id: _idKec
                }, {
                    $push: {
                        'table': { _idTable, _idKec, _idKab, sumber, catatan, ket, all_data, needFenomena, needFenomenaQ }
                    }
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createTable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createTable(null, `Data berhasil disimpan.`)
                    }
                })
            } else {
                cb_createTable(null, null)
            }
        }],
        updateTable: ['isExist', (results, cb_updateTable) => {
            if (results.isExist) {
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
                        cb_updateTable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        if (matched_kec[0]) {
                            Kec.updateOne({
                                _id: _idKec,
                                "table._idTable": _idTable
                            }, {
                                $set: {
                                    'table.$.sumber': sumber,
                                    'table.$.catatan': catatan,
                                    'table.$.ket': ket,
                                    'table.$.needFenomena': needFenomena,
                                    'table.$.needFenomenaQ': needFenomenaQ,
                                    'table.$.all_data': all_data,
                                    'table.$.arsip': [...matched_kec[0].table.arsip, ...fileToKeep]
                                }
                            }, (err, result) => {
                                if (err) {
                                    cb_updateTable(err_code.ERROR_ACCESS_DB, null)
                                } else {
                                    if (fileToDelete.length) {
                                        const file_path = __dirname + "/../../../public/static/arsip/";
                                        fileToDelete.forEach(nama_file => {
                                            if (fs.existsSync(file_path + nama_file)) {
                                                fs.unlinkSync(file_path + nama_file);
                                            }
                                        })
                                    }
                                    cb_updateTable(null, `Data berhasil diupdate.`)
                                }
                            })
                        } else {
                            cb_updateTable(null, undefined)
                        }
                    }
                })
            } else {
                cb_updateTable(null, null)
            }
        }],
    }, (err, { isExist, createTable, updateTable }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': isExist ? updateTable : createTable })
        }
    })
}