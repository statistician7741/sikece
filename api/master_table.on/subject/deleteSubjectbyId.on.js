const Subject = require('../../../models/Subject.model');
const getSubject = require('./getSubject.on');

module.exports = (_id, cb, client) => {
    Subject.deleteOne({_id}, (err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            getSubject(cb,client)
        }
    })
}