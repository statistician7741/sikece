const User = require('../../models/User.model');

module.exports = (cb, client, additionalMsg) => {
    User.findOne({ '_id': client.handshake.cookies.user_id }).exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result?result:{}, additionalMsg })
        }
    })
}