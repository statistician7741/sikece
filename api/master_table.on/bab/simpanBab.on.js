const Bab = require('../../../models/Bab.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const bab_fields = require('../../../fields/bab.fields')
const basic_func = require('../../../functions/basic.func')
const getBab = require('./getBab.on');

module.exports = (input, cb, client) => {
    const { tahun_buku, nomor } = input
    const { _id } = input
    async.auto({
        isExist: cb_isExist => {
            if(!_id){
                cb_isExist(null, null)
            } else{
                Bab.findOne({ tahun_buku, nomor }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            }
        },
        createBab: ['isExist', (results, cb_createBab) => {
            if (!results.isExist) {
                Bab.create({ ...basic_func.getFormVar(bab_fields, input, false, ['_id']), _id: `${tahun_buku}_${nomor}` }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createBab(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createBab(null, `Bab ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createBab(null, null)
            }
        }],
        updateBab: ['isExist', (results, cb_updateBab) => {
            if (results.isExist) {
                Bab.updateOne({
                    _id
                }, { ...basic_func.getFormVar(bab_fields, input, false, ['_id']) }, (err, result) => {
                    if (err) {
                        cb_updateBab(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateBab(null, `Bab ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateBab(null, null)
            }
        }],
    }, (err, { isExist, createBab, updateBab }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getBab( cb,client, isExist ? updateBab : createBab)
        }
    })
}