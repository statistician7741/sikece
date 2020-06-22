const Variable = require('../../models/Variable.model');
const Satuan = require('../../models/Satuan.model');
const Bab = require('../../models/Bab.model');
const Subject = require('../../models/Subject.model');
const Kab = require('../../models/Kab.model');
const Kec = require('../../models/Kec.model');
const Deskel = require('../../models/Deskel.model');
const User = require('../../models/User.model');

module.exports = (Model) => {
    if (Model === 'Variable') return Variable
    else if (Model === 'Satuan') return Satuan
    else if (Model === 'Bab') return Bab
    else if (Model === 'Subject') return Subject
    else if (Model === 'Kab') return Kab
    else if (Model === 'Kec') return Kec
    else if (Model === 'Deskel') return Deskel
    else if (Model === 'User') return User
    else return Variable
}