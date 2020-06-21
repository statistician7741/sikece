const Satuan = require('../../../models/Satuan.model');
const getSatuan = require('./getSatuan.on');

module.exports = (_id, cb, client) => {
    Satuan.deleteOne({_id: _id?_id.toLowerCase():_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getSatuan(cb,client)
        }
    })
}