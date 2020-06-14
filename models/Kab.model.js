var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KabSchema = new Schema({
    "_id": {
        'type': String,
        'required': true
    },
    "name": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'kab' });

module.exports = mongoose.model('Kab', KabSchema);