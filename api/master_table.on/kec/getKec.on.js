const Kec = require('../../../models/Kec.model');
const User = require('../../../models/User.model');
const Table = require('../../../models/Table.model');
const async = require('async');

module.exports = (cb, client, additionalMsg) => {
    const { user_id, jenis_pengguna, tahun_buku_monitoring } = client.handshake.cookies
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
        }
    }, (err, { getUser }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            const q = getUser ? { '_id': { '$in': getUser.kec } } : {}
            if (['pengentri', 'peny_data'].includes(jenis_pengguna)) {
                let aggQuery = [
                    { $unwind: "$table" },
                    { $match: { "table._idTable": { '$in': getUser.table } } }
                ]
                if (jenis_pengguna === 'peny_data') {
                    q["table._idTable"] = { '$in': getUser.table }
                }
                aggQuery.unshift({ $match: { ...q } })
                aggQuery.push({ $group: { _id: "$_id", kode: { $first: "$kode" }, kab: { $first: "$kab" }, name: { $first: "$name" }, ket: { $first: "$ket" }, table: { $addToSet: "$table" } } })
                Kec.aggregate(aggQuery).exec((err, result) => {
                    if (err) {
                        console.log(err);
                        cb({ 'type': 'error', 'data': err })
                    } else {
                        let missing_kec = []
                        getUser.kec.forEach(_idKec => {
                            let found = false
                            result.forEach(kec => {
                                if (kec._id === _idKec) found = true
                            })
                            if (!found) missing_kec.push(_idKec)
                        });
                        if (missing_kec.length) {
                            Kec.find({ '_id': { '$in': missing_kec } }, '_id kode kab name ket').sort('_id').exec((err, missing_kec_result) => {
                                if (err) {
                                    console.log(err);
                                    cb({ 'type': 'error', 'data': err })
                                } else {
                                    cb({ 'type': 'ok', 'data': result.concat(missing_kec_result).sort((a, b) => a._id.localeCompare(b._id)), additionalMsg })
                                }
                            })
                        } else {
                            cb({ 'type': 'ok', 'data': result, additionalMsg })
                        }
                    }
                })
            } else {
                // Table.find({ bab: new RegExp(tahun_buku_monitoring, "i") }).distinct('_id').exec((err, _tableIds) => {
                async.auto({
                    allYearsData: (a_cb) => {
                        Table.find({}).distinct('_id').exec((err, _tableIds) => {
                            if (err) {
                                console.log(err);
                                a_cb(err, null)
                            } else {
                                let aggQuery = [
                                    { $match: jenis_pengguna !== 'supervisor' ? { "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } } : { 'kab': { '$in': getUser.kab }, "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } } },
                                    { $unwind: "$table" },
                                    { $match: { "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } } }
                                ]
                                aggQuery.push({ $group: { _id: "$_id", kode: { $first: "$kode" }, kab: { $first: "$kab" }, name: { $first: "$name" }, ket: { $first: "$ket" }, table: { $addToSet: "$table" } } })
                                Kec.aggregate(aggQuery).exec((err, allKecWithTable) => {
                                    if (err) {
                                        console.log(err);
                                        a_cb(err, null)
                                    } else {
                                        //supervisor
                                        const query = jenis_pengguna !== 'supervisor' ? { '_id': { '$nin': allKecWithTable.map(kec => (kec._id)) } } :
                                            { '_id': { '$nin': allKecWithTable.map(kec => (kec._id)) }, 'kab': { '$in': getUser.kab } }
                                        Kec.find(query, '_id kode kab name ket').sort('_id').exec((err, missing_kec_result) => {
                                            if (err) {
                                                console.log(err);
                                                a_cb(err, null)
                                            } else {
                                                a_cb(null, allKecWithTable.concat(missing_kec_result).sort((a, b) => a._id.localeCompare(b._id)))
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    },
                    tahunBukuData: (t_cb) => {
                        Table.find({ bab: new RegExp(tahun_buku_monitoring, "i") }).distinct('_id').exec((err, _tableIds) => {
                            if (err) {
                                console.log(err);
                                t_cb(err, null)
                            } else {
                                let aggQuery = [
                                    {
                                        $match: jenis_pengguna !== 'supervisor' ? { "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } } :
                                            { 'kab': { '$in': getUser.kab }, "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } }
                                    },
                                    { $unwind: "$table" },
                                    { $match: { "table._idTable": { '$in': _tableIds.map(_id => (`${_id}`)) } } }
                                ]
                                aggQuery.push({ $group: { _id: "$_id", kode: { $first: "$kode" }, kab: { $first: "$kab" }, name: { $first: "$name" }, ket: { $first: "$ket" }, table: { $addToSet: "$table" } } })
                                Kec.aggregate(aggQuery).exec((err, allKecWithTable) => {
                                    if (err) {
                                        console.log(err);
                                        t_cb(err, null)
                                    } else {
                                        const q = jenis_pengguna !== 'supervisor' ? { '_id': { '$nin': allKecWithTable.map(kec => (kec._id)) } } :
                                            { '_id': { '$nin': allKecWithTable.map(kec => (kec._id)) }, 'kab': { '$in': getUser.kab } }
                                        Kec.find(q, '_id kode kab name ket').sort('_id').exec((err, missing_kec_result) => {
                                            if (err) {
                                                console.log(err);
                                                t_cb(err, null)
                                            } else {
                                                t_cb(null, allKecWithTable.concat(missing_kec_result).sort((a, b) => a._id.localeCompare(b._id)))
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    },
                }, (e, f) => {
                    cb({ 'type': 'ok', 'data': f.allYearsData, 'dataForMonitoring': f.tahunBukuData, additionalMsg })
                })
            }
        }
    })
}