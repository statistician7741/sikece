const Table = require('../../../models/Table.model');
const getTable = require('./getTable.on');

module.exports = (_id, cb, client) => {
    Table.deleteOne({_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getTable(cb,client)
        }
    })
}