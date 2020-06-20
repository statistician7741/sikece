var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeskelSchema = new Schema({
    "_id": {
        'type': String,
        'required': true
    },
    "kode": {
        'type': String,
        'required': true
    },
    "kec": {
        type: String,
        ref: 'Kec'
    },
    "kab": {
        type: String,
        ref: 'Kab'
    },
    "name": {
        'type': String,
        'required': true
    },
    "klasifikasi": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'deskel' });

module.exports = mongoose.model('Deskel', DeskelSchema);