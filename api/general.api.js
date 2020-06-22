const getFieldByText = require('./general.on/getFieldByText.on');
const isDuplicate = require('./general.on/isDuplicate.on');

function applyToClient(client) {
    client.on('api.general.autocomplete/getFieldByText', (q, cb)=>getFieldByText(q, cb,client));
    client.on('api.general.autocomplete/isDuplicate', (q, cb)=>isDuplicate(q, cb,client));
}

module.exports = applyToClient