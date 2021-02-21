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
    "profil": String,
    "jenis_pengguna": {
        'type': String,
        'required': true
    },
    "tahun_buku": {
        'type': String,
        'default': "2020"
    },
    "kab": {
        'type': [String],
        'ref': 'Kab',
        'default': []
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
    "visit_count": {
        'type': Number,
        'default': 0
    },
}, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);