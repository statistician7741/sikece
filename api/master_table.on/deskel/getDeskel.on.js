const User = require('../../../models/User.model');
const Deskel = require('../../../models/Deskel.model');
const Kec = require('../../../models/Kec.model');
const async = require('async')

module.exports = (cb, client, additionalMsg) => {
    const { user_id, jenis_pengguna } = client.handshake.cookies
    async.auto({
        getUser: cb_getUser => {
            if (jenis_pengguna) {
                if (['pengentri', 'peny_data'].includes(jenis_pengguna)) {
                    User.findOne({ _id: user_id }, (err, user) => {
                        if (err) {
                            cb_getUser(err_code.ERROR_ACCESS_DB, null)
                        } else {
                            cb_getUser(null, user)
                        }
                    })
                } else {
                    cb_getUser(null, null)
                }
            } else {
                cb_getUser(null, null)
            }
        }
    }, (err, { getUser }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            const q = getUser ? { 'kec': { '$in': getUser.kec } } : {}
            Deskel.find(q).sort('kode').exec((err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    cb({ 'type': 'ok', 'data': result, additionalMsg })
                }
            })
        }
    })
}