const simpanKab = require('./master_table.on/simpanKab.on');
const getKab = require('./master_table.on/getKab.on');
const deleteKabbyId = require('./master_table.on/deleteKabbyId.on');

function applyToClient(client) {
    client.on('api.master_tabel.kab/simpanKab', (query,cb)=>simpanKab(query,cb,client));
    client.on('api.master_tabel.kab/getKab', (cb)=>getKab(cb,client));
    client.on('api.master_tabel.kab/deleteKabbyId', (_id, cb)=>deleteKabbyId(_id, cb,client));
}

module.exports = applyToClient