const Table = require('../../../models/Table.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const table_fields = require('../../../fields/table.fields')
const basic_func = require('../../../functions/basic.func')
const getTable = require('./getTable.on');

module.exports = (input, cb, client) => {
    const { _id } = input
    async.auto({
        isExist: cb_isExist => {
            if (_id) {
                Table.findOne({ _id }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            } else{
                cb_isExist(null, null)
            }
        },
        createTable: ['isExist', (results, cb_createTable) => {
            if (!results.isExist) {
                Table.create({ ...basic_func.getFormVar(table_fields, input), _id }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createTable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createTable(null, `Tabel ${result.nomor_tabel} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createTable(null, null)
            }
        }],
        updateTable: ['isExist', (results, cb_updateTable) => {
            if (results.isExist) {
                Table.updateOne({
                    _id
                }, basic_func.getFormVar(table_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateTable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateTable(null, `Tabel ${input.nomor_tabel} berhasil diupdate.`)
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
            getTable(cb, client, isExist ? updateTable : createTable)
        }
    })
}