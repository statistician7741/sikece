const Kec = require('../../../models/Kec.model');
const async = require('async');
const err_code = require('../../../error/code.error')

module.exports = (input, cb, client) => {
    const { _idKec, _idTable } = input
    async.auto({
        getDataTable: cb_getDataTable => {
            Kec.aggregate([
                { $unwind: "$table" },
                {
                    $match: {
                        "_id": _idKec,
                        "table._idTable": _idTable
                    }
                }
            ]).exec((err, matched_kec) => {
                if (err) {
                    cb_getDataTable(err_code.ERROR_ACCESS_DB, null)
                } else {
                    if(matched_kec[0]){
                        cb_getDataTable(null, matched_kec[0].table)
                    } else{
                        cb_getDataTable(null, undefined)
                    }
                }
            })
        }
    }, (err, { getDataTable }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': getDataTable })
        }
    })
}