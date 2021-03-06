const simpanUser = require('./master_user.on/simpanUser.on');
const getUser = require('./master_user.on/getUser.on');
const deleteUserbyId = require('./master_user.on/deleteUserbyId.on');
const getActiveUser = require('./master_user.on/getActiveUser.on');
const getTopVisitor = require('./master_user.on/getTopVisitor.on');

function applyToClient(client) {
    client.on('api.master_user.user/simpanUser', (query,cb)=>simpanUser(query,cb,client));
    client.on('api.master_user.user/getUser', (cb)=>getUser(cb,client));
    client.on('api.master_user.user/deleteUserbyId', (_id, cb)=>deleteUserbyId(_id, cb,client));
    client.on('api.master_user.user/getActiveUser', (cb)=>getActiveUser(cb,client));
    client.on('api.master_user.user/getTopVisitor', (cb)=>getTopVisitor(cb,client));
}

module.exports = applyToClient