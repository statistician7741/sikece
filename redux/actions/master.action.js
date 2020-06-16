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
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const getBab = (socket, tahun_buku) => dispatch => {
  socket.emit('api.master_tabel.bab/getBab', tahun_buku, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: [] })
    }
  })
}
export const simpanBab = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.bab/simpanBab', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const deleteBabbyId = (socket, { _id, tahun_buku }) => dispatch => {
  socket.emit('api.master_tabel.bab/deleteBabbyId', { _id, tahun_buku }, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: [] })
    }
  })
}
export const getSatuan = (socket) => dispatch => {
  socket.emit('api.master_tabel.satuan/getSatuan', (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: [] })
    }
  })
}
export const deleteSatuanbyId = (socket, _id) => dispatch => {
  socket.emit('api.master_tabel.satuan/deleteSatuanbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: [] })
    }
  })
}
export const simpanSatuan = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.satuan/simpanSatuan', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const getSubject = (socket) => dispatch => {
  socket.emit('api.master_tabel.subject/getSubject', (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: [] })
    }
  })
}
export const deleteSubjectbyId = (socket, _id) => dispatch => {
  socket.emit('api.master_tabel.subject/deleteSubjectbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: [] })
    }
  })
}
export const simpanSubject = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.subject/simpanSubject', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}