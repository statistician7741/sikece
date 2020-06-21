const Satuan = require('../../../models/Satuan.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const satuan_fields = require('../../../fields/satuan.fields')
const basic_func = require('../../../functions/basic.func')
const getSatuan = require('./getSatuan.on');

module.exports = (input, cb, client) => {
    const {_id} = input
    async.auto({
        isExist: cb_isExist => {
            if (!_id) {
                cb_isExist(null, null)
            } else {
                Satuan.findOne({ _id }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            }
        },
        createSatuan: ['isExist', (results, cb_createSatuan) => {
            if (!results.isExist) {
                Satuan.create({ ...basic_func.getFormVar(satuan_fields, input, false, ['_id']) }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createSatuan(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createSatuan(null, `Satuan ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createSatuan(null, null)
            }
        }],
        updateSatuan: ['isExist', (results, cb_updateSatuan) => {
            if (results.isExist) {
                Satuan.updateOne({
                    _id
                }, basic_func.getFormVar(satuan_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateSatuan(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateSatuan(null, `Satuan ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateSatuan(null, null)
            }
        }],
    }, (err, { isExist, createSatuan, updateSatuan }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getSatuan(cb, client, isExist ? updateSatuan : createSatuan)
        }
    })
}