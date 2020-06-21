const Subject = require('../../../models/Subject.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const subject_fields = require('../../../fields/subject.fields')
const basic_func = require('../../../functions/basic.func')
const getSubject = require('./getSubject.on');

module.exports = (input, cb, client) => {
    const {_id} = input
    async.auto({
        isExist: cb_isExist => {
            if (!_id) {
                cb_isExist(null, null)
            } else {
                Subject.findOne({ _id }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            }
        },
        createSubject: ['isExist', (results, cb_createSubject) => {
            if (!results.isExist) {
                Subject.create({...basic_func.getFormVar(subject_fields, input, false, ['_id'])}, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createSubject(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createSubject(null, `Subjek ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createSubject(null, null)
            }
        }],
        updateSubject: ['isExist', (results, cb_updateSubject) => {
            if (results.isExist) {
                Subject.updateOne({
                    _id
                }, basic_func.getFormVar(subject_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateSubject(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateSubject(null, `Subjek ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateSubject(null, null)
            }
        }],
    }, (err, { isExist, createSubject, updateSubject }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getSubject(cb,client, isExist ? updateSubject : createSubject)
        }
    })
}