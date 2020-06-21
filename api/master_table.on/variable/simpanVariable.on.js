const Variable = require('../../../models/Variable.model');
const async = require('async')
const err_code = require('../../../error/code.error')
const variable_fields = require('../../../fields/variable.fields')
const basic_func = require('../../../functions/basic.func')
const getVariable = require('./getVariable.on');

module.exports = (input, cb, client) => {
    const { _id } = input
    async.auto({
        isExist: cb_isExist => {
            if (_id) {
                Variable.findOne({ _id }, (err, result) => {
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
        createVariable: ['isExist', (results, cb_createVariable) => {
            if (!results.isExist) {
                Variable.create({ ...basic_func.getFormVar(variable_fields, input), _id }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createVariable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createVariable(null, `Variabel ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createVariable(null, null)
            }
        }],
        updateVariable: ['isExist', (results, cb_updateVariable) => {
            if (results.isExist) {
                Variable.updateOne({
                    _id
                }, basic_func.getFormVar(variable_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateVariable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateVariable(null, `Variabel ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateVariable(null, null)
            }
        }],
    }, (err, { isExist, createVariable, updateVariable }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getVariable(cb, client, isExist ? updateVariable : createVariable)
        }
    })
}