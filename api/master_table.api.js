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

const simpanKec = require('./master_table.on/kec/simpanKec.on');
const getKec = require('./master_table.on/kec/getKec.on');
const deleteKecbyId = require('./master_table.on/kec/deleteKecbyId.on');
const simpanData = require('./master_table.on/kec/simpanData.on');
const getDataTable = require('./master_table.on/kec/getDataTable.on');
const deleteTableDatabyId = require('./master_table.on/kec/deleteTableDatabyId.on');
const setIsApprove = require('./master_table.on/kec/setIsApprove.on');

const simpanDeskel = require('./master_table.on/deskel/simpanDeskel.on');
const getDeskel = require('./master_table.on/deskel/getDeskel.on');
const deleteDeskelbyId = require('./master_table.on/deskel/deleteDeskelbyId.on');

const simpanVariable = require('./master_table.on/variable/simpanVariable.on');
const getVariable = require('./master_table.on/variable/getVariable.on');
const deleteVariablebyId = require('./master_table.on/variable/deleteVariablebyId.on');

const simpanTable = require('./master_table.on/table/simpanTable.on');
const getTable = require('./master_table.on/table/getTable.on');
const deleteTablebyId = require('./master_table.on/table/deleteTablebyId.on');
const getFieldByText = require('./master_table.on/table/getFieldByText.on');

function applyToClient(client) {
    client.on('api.master_tabel.kab/simpanKab', (query,cb)=>simpanKab(query,cb,client));
    client.on('api.master_tabel.kab/getKab', (cb)=>getKab(cb,client));
    client.on('api.master_tabel.kab/deleteKabbyId', (_id, cb)=>deleteKabbyId(_id, cb,client));
    
    client.on('api.master_tabel.bab/simpanBab', (query,cb)=>simpanBab(query,cb,client));
    client.on('api.master_tabel.bab/getBab', (cb)=>getBab(cb,client));
    client.on('api.master_tabel.bab/deleteBabbyId', (_id,cb)=>deleteBabbyId(_id,cb,client));
    client.on('api.master_tabel.bab/getAllYearsBab', (cb)=>getAllYearsBab(cb,client));
    
    client.on('api.master_tabel.satuan/simpanSatuan', (query,cb)=>simpanSatuan(query,cb,client));
    client.on('api.master_tabel.satuan/getSatuan', (cb)=>getSatuan(cb,client));
    client.on('api.master_tabel.satuan/deleteSatuanbyId', (_id, cb)=>deleteSatuanbyId(_id, cb,client));
    
    client.on('api.master_tabel.subject/simpanSubject', (query,cb)=>simpanSubject(query,cb,client));
    client.on('api.master_tabel.subject/getSubject', (cb)=>getSubject(cb,client));
    client.on('api.master_tabel.subject/deleteSubjectbyId', (_id, cb)=>deleteSubjectbyId(_id, cb,client));
    
    client.on('api.master_tabel.kec/simpanKec', (query,cb)=>simpanKec(query,cb,client));
    client.on('api.master_tabel.kec/getKec', (cb)=>getKec(cb,client));
    client.on('api.master_tabel.kec/deleteKecbyId', (_id, cb)=>deleteKecbyId(_id, cb,client));
    client.on('api.master_tabel.kec/simpanData', (data, cb)=>simpanData(data, cb,client));
    client.on('api.master_tabel.kec/getDataTable', (data, cb)=>getDataTable(data, cb,client));
    client.on('api.master_tabel.kec/deleteTableDatabyId', (data, cb)=>deleteTableDatabyId(data, cb,client));
    client.on('api.master_tabel.kec/setIsApprove', (data, cb)=>setIsApprove(data, cb,client));
    
    client.on('api.master_tabel.deskel/simpanDeskel', (query,cb)=>simpanDeskel(query,cb,client));
    client.on('api.master_tabel.deskel/getDeskel', (cb)=>getDeskel(cb,client));
    client.on('api.master_tabel.deskel/deleteDeskelbyId', (_id, cb)=>deleteDeskelbyId(_id, cb,client));
    
    client.on('api.master_tabel.variable/simpanVariable', (query,cb)=>simpanVariable(query,cb,client));
    client.on('api.master_tabel.variable/getVariable', (cb)=>getVariable(cb,client));
    client.on('api.master_tabel.variable/deleteVariablebyId', (_id, cb)=>deleteVariablebyId(_id, cb,client));
    
    client.on('api.master_tabel.table/simpanTable', (query,cb)=>simpanTable(query,cb,client));
    client.on('api.master_tabel.table/getTable', (cb)=>getTable(cb,client));
    client.on('api.master_tabel.table/deleteTablebyId', (_id, cb)=>deleteTablebyId(_id, cb,client));
    client.on('api.master_tabel.table/getFieldByText', (q, cb)=>getFieldByText(q, cb,client));
}

module.exports = applyToClient