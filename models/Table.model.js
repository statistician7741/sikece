var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema({
    "bab": {
        'type': String,
        'ref': 'Bab',
        'required': true
    },
    "nomor_tabel": {
        'type': String,
        'required': true
    },
    "judul": {
        'type': String,
        'required': true
    },
    "baris": {
        'type': [String],
        'ref': 'Variable',
        'default': []
    },
    "kolom": {
        'type': [String],
        'ref': 'Variable',
        'default': []
    },
    "sumber": {
        'type': String,
        'required': true
    },
    "catatan": String,
    "ket": String,
}, { collection: 'table' });

module.exports = mongoose.model('Table', TableSchema);