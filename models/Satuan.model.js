var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SatuanSchema = new Schema({
    "_id": {
        'type': String,
        'required': true
    },
    "name": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'satuan' });

module.exports = mongoose.model('Satuan', SatuanSchema);