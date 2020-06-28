var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VariabelSchema = new Schema({
    "name": {
        'type': String,
        'required': true
    },
    "subject": {
        type: String,
        ref: 'Subject'
    },
    "kelompok": String,
    "satuan": String,
    // "jenis": String,
    // "desimal": String,
    // "jenis_agregat": String,
    // "jenis_grafik": String,
    "ket": String,
}, { collection: 'variable' });

module.exports = mongoose.model('Variabel', VariabelSchema);