import * as actionTypes from "../types/user.type";

export const setActiveUser = (socket) => dispatch => {
  socket.emit('api.master_user.user/getActiveUser', (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user: response.data, penyDataCount: response.penyDataCount, tahun_buku_monitoring: response.tahun_buku_monitoring })
    } else {
      return dispatch({ type: actionTypes.SET_ALL_USER, active_user: {} })
    }
  })
}
export const resetActiveUser = () => dispatch => {
  return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user: {} })
}
export const getUser = (socket) => dispatch => {
  socket.emit('api.master_user.user/getUser', (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_ALL_USER, all_user: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_ALL_USER, all_user: [] })
    }
  })
}
export const deleteUserbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_user.user/deleteUserbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_ALL_USER, all_user: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanUser = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_user.user/simpanUser', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_ALL_USER, all_user: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}