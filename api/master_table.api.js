const simpanKab = require('./master_table.on/kab/simpanKab.on');
const getKab = require('./master_table.on/kab/getKab.on');
const deleteKabbyId = require('./master_table.on/kab/deleteKabbyId.on');

const simpanBab = require('./master_table.on/bab/simpanBab.on');
const getBab = require('./master_table.on/bab/getBab.on');
const deleteBabbyId = require('./master_table.on/bab/deleteBabbyId.on');
const getAllYearsBab = require('./master_table.on/bab/getAllYearsBab.on');

const simpanSatuan = require('./master_table.on/satuan/simpanSatuan.on');
const getSatuan = require('./master_table.on/satuan/getSatuan.on');
const deleteSatuanbyId = require('./master_table.on/satuan/deleteSatuanbyId.on');

const simpanSubject = require('./master_table.on/subject/simpanSubject.on');
const getSubject = require('./master_table.on/subject/getSubject.on');
const deleteSubjectbyId = require('./master_table.on/subject/deleteSubjectbyId.on');

function applyToClient(client) {
    client.on('api.master_tabel.kab/simpanKab', (query,cb)=>simpanKab(query,cb,client));
    client.on('api.master_tabel.kab/getKab', (cb)=>getKab(cb,client));
    client.on('api.master_tabel.kab/deleteKabbyId', (_id, cb)=>deleteKabbyId(_id, cb,client));
    
    client.on('api.master_tabel.bab/simpanBab', (query,cb)=>simpanBab(query,cb,client));
    client.on('api.master_tabel.bab/getBab', (tahun_buku,cb)=>getBab(tahun_buku,cb,client));
    client.on('api.master_tabel.bab/deleteBabbyId', ({_id,tahun_buku},cb)=>deleteBabbyId({_id,tahun_buku},cb,client));
    client.on('api.master_tabel.bab/getAllYearsBab', (cb)=>getAllYearsBab(cb,client));
    
    client.on('api.master_tabel.satuan/simpanSatuan', (query,cb)=>simpanSatuan(query,cb,client));
    client.on('api.master_tabel.satuan/getSatuan', (cb)=>getSatuan(cb,client));
    client.on('api.master_tabel.satuan/deleteSatuanbyId', (_id, cb)=>deleteSatuanbyId(_id, cb,client));
    
    client.on('api.master_tabel.subject/simpanSubject', (query,cb)=>simpanSubject(query,cb,client));
    client.on('api.master_tabel.subject/getSubject', (cb)=>getSubject(cb,client));
    client.on('api.master_tabel.subject/deleteSubjectbyId', (_id, cb)=>deleteSubjectbyId(_id, cb,client));
}

module.exports = applyToClient