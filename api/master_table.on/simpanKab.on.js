const Kab = require('../../models/Kab.model');
const async = require('async')
const err_code = require('../../error/code.error')
const kab_fields = require('../../fields/kab.fields')
const basic_func = require('../../functions/basic.func')
const getKab = require('./getKab.on');

module.exports = (input, cb, client) => {
    const { _id } = input
    async.auto({
        isExist: cb_isExist => {
            Kab.findOne({ _id }, (err, result) => {
                if (err) {
                    cb_isExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isExist(null, result)
                }
            })
        },
        createKab: ['isExist', (results, cb_createKab) => {
            if (!results.isExist) {
                Kab.create(basic_func.getFormVar(kab_fields, input), (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createKab(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createKab(null, `Kabupaten ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createKab(null, null)
            }
        }],
        updateKab: ['isExist', (results, cb_updateKab) => {
            if (results.isExist) {
                Kab.updateOne({
                    _id
                }, basic_func.getFormVar(kab_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateKab(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateKab(null, `Kabupaten ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateKab(null, null)
            }
        }],
    }, (err, { isExist, createKab, updateKab }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getKab(cb,client, isExist ? updateKab : createKab)
        }
    })
}