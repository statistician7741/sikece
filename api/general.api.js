const getFieldByText = require('./general.on/getFieldByText.on');
const isDuplicate = require('./general.on/isDuplicate.on');
const getMonitoringData = require('./general.on/getMonitoringData.on');
const unduhTable = require('./general.on/unduhTable.on');
const unduhAllTable = require('./general.on/unduhAllTable.on');

function applyToClient(client) {
    client.on('api.general.autocomplete/getFieldByText', (q, cb)=>getFieldByText(q, cb,client));
    client.on('api.general.autocomplete/isDuplicate', (q, cb)=>isDuplicate(q, cb,client));
    client.on('api.general.monitoring/getMonitoringData', (type,cb)=>getMonitoringData(type,cb,client));
    client.on('api.general.unduh/unduhTable', (input,cb)=>unduhTable(input,cb,client));
    client.on('api.general.unduh/unduhAllTable', (input,cb)=>unduhAllTable(input,cb,client));
}

module.exports = applyToClient