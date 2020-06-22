const Subject = require('../../../models/Subject.model');

module.exports = (cb, client, additionalMsg) => {
    Subject.find({}).sort('name').exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result, additionalMsg })
        }
    })
}