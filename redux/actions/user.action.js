import * as actionTypes from "../types/user.type";

export const setActiveUser = (socket) => dispatch => {
    socket.emit('api.socket.organik/s/getActiveUser', (active_user) => {
        return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user })
    })
}

export const resetActiveUser = () => dispatch => {
    return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user: {} })
}

export const setTTDSPD = (socket, ttd, cb) => dispatch => {
    socket.emit('api.socket.spd/s/setTTDSPD', ttd, ( result )=>{
        cb();
        return dispatch({ type: actionTypes.SET_TTD_SPD, ttd })
    })
}