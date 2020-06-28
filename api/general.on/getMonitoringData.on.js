const getModel = require('./getModel')
module.exports = (type, cb, client) => {
    const { tahun_buku_monitoring } = client.handshake.cookies
    if (type === 'jumlah_kec') {
        getModel('Kec').countDocuments({}).exec((err, kecCount) => {
            if (err) {
                console.log(err);
                cb({ 'type': 'error', 'data': err })
            } else {
                cb({ 'type': 'ok', 'data': { [type]: kecCount } })
            }
        });
    } else if (type === 'total_tabel') {
        getModel('Table').countDocuments({ bab: new RegExp(tahun_buku_monitoring, "i") }).exec((err, tableCount) => {
            if (err) {
                console.log(err);
                cb({ 'type': 'error', 'data': err })
            } else {
                cb({ 'type': 'ok', 'data': { [type]: tableCount } })
            }
        });
    } else if (type === 'total_entri') {
        getModel('Table').find({ bab: new RegExp(tahun_buku_monitoring, "i") }, '_id').distinct('_id').exec((err, table_ids) => {
            if (err) {
                console.log(err);
                cb({ 'type': 'error', 'data': err })
            } else {
                if (table_ids.length) {
                    let aggQuery = [
                        { $match: { "table._idTable": { '$in': table_ids } } },
                        { $unwind: "$table" },
                        { $match: { "table._idTable": { '$in': table_ids } } }
                    ]
                    aggQuery.push({ "$group": { _id: "$_id", table: { $addToSet: "$table" } } })
                    getModel('Kec').aggregate(aggQuery).exec((err, result) => {
                        if (err) {
                            console.log(err);
                            cb({ 'type': 'error', 'data': err })
                        } else {
                            console.log(result, table_ids);
                            cb({ 'type': 'ok', 'data': { [type]: result.length } })
                        }
                    })
                } else {
                    cb({ 'type': 'ok', 'data': { [type]: 0 } })
                }
            }
        });
    } else if (type === 'total_disetujui') {
        getModel('Table').countDocuments({ bab: new RegExp(tahun_buku_monitoring, "i") }).exec((err, tableCount) => {
            if (err) {
                console.log(err);
                cb({ 'type': 'error', 'data': err })
            } else {
                cb({ 'type': 'ok', 'data': { [type]: tableCount } })
            }
        });
    } else if (type === 'total_penyedia_data') {
        getModel('Table').countDocuments({ bab: new RegExp(tahun_buku_monitoring, "i") }).exec((err, tableCount) => {
            if (err) {
                console.log(err);
                cb({ 'type': 'error', 'data': err })
            } else {
                cb({ 'type': 'ok', 'data': { [type]: tableCount } })
            }
        });
    }
}