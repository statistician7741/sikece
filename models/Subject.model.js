var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    "name": {
        'type': String,
        'required': true
    },
    "ket": String,
}, { collection: 'subject' });

module.exports = mongoose.model('Subject', SubjectSchema);