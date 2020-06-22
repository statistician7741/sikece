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
    "kec": {
        'type': [String],
        'ref': 'Kec',
        'default': []
    },
    "table": {
        'type': [String],
        'ref': 'Table',
        'default': []
    },
    "ket": String,
}, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);