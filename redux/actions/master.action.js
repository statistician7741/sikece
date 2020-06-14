import * as actionTypes from "../types/master.type";

export const getKab = (socket) => dispatch => {
  socket.emit('api.master_tabel.kab/getKab', (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: [] })
    }
  })
}
export const deleteKabbyId = (socket, _id) => dispatch => {
  socket.emit('api.master_tabel.kab/deleteKabbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: [] })
    }
  })
}
export const simpanKab = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.kab/simpanKab', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg&&props.showSuccessMessage(response.additionalMsg)
      cb&&cb()
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: response.data })
    } else {
      response.additionalMsg&&props.showErrorMessage(response.additionalMsg)
    }
  })
}