const simpanUser = require('./master_user.on/simpanUser.on');
const getUser = require('./master_user.on/getUser.on');
const deleteUserbyId = require('./master_user.on/deleteUserbyId.on');

function applyToClient(client) {
    client.on('api.master_user.user/simpanUser', (query,cb)=>simpanUser(query,cb,client));
    client.on('api.master_user.user/getUser', (cb)=>getUser(cb,client));
    client.on('api.master_user.user/deleteUserbyId', (_id, cb)=>deleteUserbyId(_id, cb,client));
}

module.exports = applyToClient