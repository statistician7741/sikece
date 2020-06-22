const getModel = require('./getModel')
module.exports = (q, cb, client) => {
    getModel(q.Model).findOne({[q.field]: new RegExp(`^${q.query}$`, "i")}).exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result?true:false })
        }
    })
}