const Kab = require('../../../models/Kab.model');
const Kec = require('../../../models/Kec.model');
const getKab = require('./getKab.on');
const async = require('async');
const err_code = require('../../../error/code.error')

module.exports = (_id, cb, client) => {
    async.auto({
        isChildExist: cb_isChildExist => {
            Kec.findOne({ kab: _id }, (err, result) => {
                if (err) {
                    cb_isChildExist(err_code.ERROR_ACCESS_DB, null)
                } else {
                    cb_isChildExist(result?err_code.ERROR_KAB_CHILD_EXIST:null, result)
                }
            })
        }
    }, (err, { isChildExist }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            Kab.deleteOne({ _id }, (err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    client.broadcast.emit('refreshGrafik', {isKec: true, isKab: true});
                    getKab(cb, client)
                }
            })
        }
    })
}