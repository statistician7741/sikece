const getFieldByText = require('./general.on/getFieldByText.on');

function applyToClient(client) {
    client.on('api.general.autocomplete/getFieldByText', (q, cb)=>getFieldByText(q, cb,client));
}

module.exports = applyToClient