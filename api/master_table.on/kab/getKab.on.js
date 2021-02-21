const User = require('../../../models/User.model');
const Kab = require('../../../models/Kab.model');
const Kec = require('../../../models/Kec.model');
const async = require('async')

module.exports = (cb, client, additionalMsg) => {
    const { user_id, jenis_pengguna } = client.handshake.cookies
    async.auto({
        getUser: cb_getUser => {
            if (jenis_pengguna) {
                if (['pengentri', 'peny_data', 'supervisor'].includes(jenis_pengguna)) {
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
        },
        getKec: ['getUser', (result, cb_getKec) => {
            if (result.getUser) {
                if (jenis_pengguna !== 'supervisor') {
                    Kec.findOne({ '_id': { '$in': result.getUser.kec } }).distinct('kab').exec((err, kabs) => {
                        if (err) {
                            cb_getKec(err_code.ERROR_ACCESS_DB, null)
                        } else {
                            cb_getKec(null, kabs)
                        }
                    })
                } else {
                    cb_getKec(null, result.getUser.kab)
                }
            } else {
                cb_getKec(null, null)
            }
        }]
    }, (err, { getKec }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            const q = getKec ? { '_id': { '$in': getKec } } : {}
            Kab.find(q).sort('_id').exec((err, result) => {
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