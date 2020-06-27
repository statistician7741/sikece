var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KecSchema = new Schema({
    "_id": {
        'type': String,
        'required': true
    },
    "kode": {
        'type': String,
        'required': true
    },
    "kab": {
        type: String,
        ref: 'Kab',
        'required': true
    },
    "name": {
        'type': String,
        'required': true
    },
    "ket": String,
    "table": {
        'type': [{
            '_idTable': String,
            'sumber': String,
            'catatan': {
                'type': String,
                default: ""
            },
            'ket': {
                'type': String,
                default: ""
            },
            'all_data': [],
            'arsip': [],
            'isApproved': Boolean,
            'comments': []
        }],
        'default': []
    }
}, { collection: 'kec' });

module.exports = mongoose.model('Kec', KecSchema);