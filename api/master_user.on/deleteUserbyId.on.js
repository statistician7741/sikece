const User = require('../../models/User.model');
const getUser = require('./getUser.on');
const err_code = require('../../error/code.error')

module.exports = (_id, cb, client) => {
    User.deleteOne({ _id }, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err_code.ERROR_ACCESS_DB })
        } else {
            getUser(cb, client)
        }
    })
}