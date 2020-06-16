var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BabSchema = new Schema({
    "_id": {
        'type': String,
        'required': true
    },
    "tahun_buku": {
        'type': String,
        'required': true
    },
    "nomor": {
        'type': String,
        'required': true
    },
    "name": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'bab' });

module.exports = mongoose.model('Bab', BabSchema);