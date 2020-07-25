const Kec = require('../../../models/Kec.model');
const Deskel = require('../../../models/Deskel.model');
const getKec = require('./getKec.on');
const async = require('async');
const err_code = require('../../../error/code.error')

module.exports = (_id, cb, client) => {
    async.auto({
        isChildExist: cb_isChildExist => {
            Deskel.findOne({ kec: _id }, (err, result) => {
                if (err) {
                    cb_isChildExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isChildExist(result ? err_code.ERROR_KEC_CHILD_EXIST : null, result)
                }
            })
        }
    }, (err, { isChildExist }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            Kec.deleteOne({ _id }, (err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    client.broadcast.emit('refreshGrafik', {isKec: true});
                    getKec(cb, client)
                }
            })
        }
    })
}