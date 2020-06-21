const Deskel = require('../../../models/Deskel.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const deskel_fields = require('../../../fields/deskel.fields')
const basic_func = require('../../../functions/basic.func')
const getDeskel = require('./getDeskel.on');

module.exports = (input, cb, client) => {
    const {_id} = input
    async.auto({
        isExist: cb_isExist => {
            if(!_id){
                cb_isExist(null, null)
            } else{
                Deskel.findOne({ _id }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            }
        },
        createDeskel: ['isExist', (results, cb_createDeskel) => {
            if (!results.isExist) {
                Deskel.create({...basic_func.getFormVar(deskel_fields, input, false, ['_id']), _id: `${input.kec}.${input.kode}`}, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createDeskel(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createDeskel(null, `${result.klasifikasi} ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createDeskel(null, null)
            }
        }],
        updateDeskel: ['isExist', (results, cb_updateDeskel) => {
            if (results.isExist) {
                Deskel.updateOne({
                    _id
                }, basic_func.getFormVar(deskel_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateDeskel(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateDeskel(null, `${input.klasifikasi} ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateDeskel(null, null)
            }
        }],
    }, (err, { isExist, createDeskel, updateDeskel }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getDeskel(cb,client, isExist ? updateDeskel : createDeskel)
        }
    })
}