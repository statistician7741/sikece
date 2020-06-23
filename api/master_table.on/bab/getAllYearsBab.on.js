const Bab = require('../../../models/Bab.model');
const User = require('../../../models/User.model');
const Table = require('../../../models/Table.model');
const async = require('async')

module.exports = (cb, client) => {
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
        },
        getTable: ['getUser', (result, cb_getTable) => {
            if (result.getUser) {
                Table.findOne({ '_id': { '$in': result.getUser.table } }).distinct('bab').exec((err, kabs) => {
                    if (err) {
                        cb_getTable(err_code.ERROR_ACCESS_DB, null)
                    } else {
                        cb_getTable(null, kabs)
                    }
                })
            } else {
                cb_getTable(null, null)
            }
        }]
    }, (err, { getTable }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            const q = getTable ? { '_id': { '$in': getTable } } : {}
            Bab.find(q).distinct('tahun_buku').exec((err, result) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    cb({ 'type': 'ok', 'data': result })
                }
            })
        }
    })
}