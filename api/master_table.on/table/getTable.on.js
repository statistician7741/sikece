const Table = require('../../../models/Table.model');
const User = require('../../../models/User.model');
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
            const q = getUser ? { '_id': { '$in': getUser.table } } : {}
            Table.find(q).exec((err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    cb({ 
                        'type': 'ok', 
                        'data': result.map( a => ({ ...a._doc, nomor_tabel: a.nomor_tabel.split('.').map( n => +n+100000 ).join('.') }) ).sort((a, b) => (a.nomor_tabel > b.nomor_tabel) ? 1 : -1)
                        .map( a => ({ ...a, nomor_tabel: a.nomor_tabel.split('.').map( n => +n-100000 ).join('.') }) ), 
                        additionalMsg
                     })
                }
            })
        }
    })
}