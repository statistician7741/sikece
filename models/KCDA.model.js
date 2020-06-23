var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KCDASchema = new Schema({
    "_id": {
        'type': String, //2020_7404_060
        'required': true
    },
    "tahun_buku": {
        'type': String,
        'required': true
    },
    "kec": {
        type: String,
        ref: 'KCDA',
        'required': true
    },
    "data": [],
    "ket": String,
}, { collection: 'kec' });

module.exports = mongoose.model('KCDA', KCDASchema);

const data = {
    '_id': String,
    '_id_table': String,
    '_id_baris': String,
    '_id_kolom': String,
    'value': String,
}