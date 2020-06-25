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
            'catatan': String,
            'ket': String,
            'all_data': [],
            'arsip': [],
            'isFinal': {
                'type': Boolean,
                'default': false
            },
            'isApproved': {
                'type': Boolean,
                'default': false
            },
            'comments': []
        }],
        'default': []
    }
}, { collection: 'kec' });

module.exports = mongoose.model('Kec', KecSchema);

// const kcda = {
//     _id,
//     _idTable,
//     sumber,
//     catatan,
//     ket,
//     data,
//     arsip,//array of path
//     isFinal,
//     isApproved,
//     comments: [], //{ _id, peny_data, text }
// }