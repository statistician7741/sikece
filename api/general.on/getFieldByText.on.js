const Variable = require('../../models/Variable.model');
const Satuan = require('../../models/Satuan.model');
const Bab = require('../../models/Bab.model');
const Subject = require('../../models/Subject.model');
const Kab = require('../../models/Kab.model');
const Kec = require('../../models/Kec.model');
const Deskel = require('../../models/Deskel.model');
const User = require('../../models/User.model');

function getModel(Model){
    if(Model === 'Variable') return Variable
    else if(Model === 'Satuan') return Satuan
    else if(Model === 'Bab') return Bab
    else if(Model === 'Subject') return Subject
    else if(Model === 'Kab') return Kab
    else if(Model === 'Kec') return Kec
    else if(Model === 'Deskel') return Deskel
    else if(Model === 'User') return User
    else return Variable
}

module.exports = (q, cb, client) => {
    getModel(q.Model).find({[q.field]: new RegExp(q.query, "i")}).distinct(q.field).exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result.map(r=>({value: r})) })
        }
    })
}