const Kec = require('../../../models/Kec.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const kec_fields = require('../../../fields/kec.fields')
const basic_func = require('../../../functions/basic.func')
const getKec = require('./getKec.on');

module.exports = (input, cb, client) => {
    const _id = `${input.kab}.${input.kode}`
    async.auto({
        isExist: cb_isExist => {
            Kec.findOne({ _id }, (err, result) => {
                if (err) {
                    cb_isExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isExist(null, result)
                }
            })
        },
        createKec: ['isExist', (results, cb_createKec) => {
            if (!results.isExist) {
                Kec.create({...basic_func.getFormVar(kec_fields, input), _id}, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createKec(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createKec(null, `Kecamatan ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createKec(null, null)
            }
        }],
        updateKec: ['isExist', (results, cb_updateKec) => {
            if (results.isExist) {
                Kec.updateOne({
                    _id
                }, basic_func.getFormVar(kec_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateKec(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateKec(null, `Kecamatan ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateKec(null, null)
            }
        }],
    }, (err, { isExist, createKec, updateKec }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getKec(cb,client, isExist ? updateKec : createKec)
        }
    })
}