const getFieldByText = require('./general.on/getFieldByText.on');
const isDuplicate = require('./general.on/isDuplicate.on');
const getMonitoringData = require('./general.on/getMonitoringData.on');

function applyToClient(client) {
    client.on('api.general.autocomplete/getFieldByText', (q, cb)=>getFieldByText(q, cb,client));
    client.on('api.general.autocomplete/isDuplicate', (q, cb)=>isDuplicate(q, cb,client));
    client.on('api.general.monitoring/getMonitoringData', (type,cb)=>getMonitoringData(type,cb,client));
}

module.exports = applyToClient