const Table = require('../../../models/Table.model');

module.exports = (q, cb, client) => {
    Table.find({[q.field]: new RegExp(q.query, "i"), "bab": new RegExp(`^${q.tahun}_`, 'i')}).distinct(q.field).exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result.map(r=>({value: r})) })
        }
    })
}