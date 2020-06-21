const User = require('../../models/User.model');
const async = require('async')
const err_code = require('../../error/code.error')
const user_fields = require('../../fields/user.fields')
const basic_func = require('../../functions/basic.func')
const getUser = require('./getUser.on');

module.exports = (input, cb, client) => {
    const { _id } = input
    async.auto({
        isExist: cb_isExist => {
            if(!_id){
                cb_isExist(null, null)
            } else{
                User.findOne({ _id }, (err, result) => {
                    if (err) {
                        cb_isExist(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_isExist(null, result)
                    }
                })
            }
        },
        createUser: ['isExist', (results, cb_createUser) => {
            if (!results.isExist) {
                User.create(basic_func.getFormVar(user_fields, input), (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_createUser(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_createUser(null, `Userupaten ${result.name} berhasil disimpan.`)
                    }
                })
            } else {
                cb_createUser(null, null)
            }
        }],
        updateUser: ['isExist', (results, cb_updateUser) => {
            if (results.isExist) {
                User.updateOne({
                    _id
                }, basic_func.getFormVar(user_fields, input, false, ['_id']), (err, result) => {
                    if (err) {
                        cb_updateUser(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_updateUser(null, `Userupaten ${input.name} berhasil diupdate.`)
                    }
                })
            } else {
                cb_updateUser(null, null)
            }
        }],
    }, (err, { isExist, createUser, updateUser }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            getUser(cb,client, isExist ? updateUser : createUser)
        }
    })
}