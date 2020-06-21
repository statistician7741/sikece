const Variable = require('../../../models/Variable.model');
const Table = require('../../../models/Table.model');
const getVariable = require('./getVariable.on');
const async = require('async');
const err_code = require('../../../error/code.error');

module.exports = (_id, cb, client) => {
    async.auto({
        isChildExist: cb_isChildExist => {
            Table.findOne({
                '$or': [
                    { 'baris': { '$elemMatch': { '$eq': _id } } },
                    { 'kolom': { '$elemMatch': { '$eq': _id } } }
                ]
            }, (err, result) => {
                if (err) {
                    cb_isChildExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isChildExist(result ? err_code.ERROR_VAR_TABLE_EXIST : null, result)
                }
            })
        }
    }, (err, { isChildExist }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            Variable.deleteOne({ _id }, (err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    getVariable(cb, client)
                }
            })
        }
    })
}