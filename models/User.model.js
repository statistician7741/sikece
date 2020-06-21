var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    "username": {
        'type': String,
        'required': true
    },
    "password": {
        'type': String,
        'required': true
    },
    "name": {
        'type': String,
        'required': true
    },
    "jenis_pengguna": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);