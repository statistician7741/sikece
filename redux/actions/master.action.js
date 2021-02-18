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
export const deleteKabbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.kab/deleteKabbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_KAB, all_kab: response.data })
    } else {
      props.showErrorMessage(response.data)
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
export const getBab = (socket) => dispatch => {
  socket.emit('api.master_tabel.bab/getBab', (response) => {
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
export const deleteBabbyId = (socket, { _id, tahun_buku }, props) => dispatch => {
  socket.emit('api.master_tabel.bab/deleteBabbyId', { _id, tahun_buku }, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_BAB, all_bab: response.data })
    } else {
      props.showErrorMessage(response.data)
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
export const deleteSatuanbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.satuan/deleteSatuanbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SATUAN, all_satuan: response.data })
    } else {
      props.showErrorMessage(response.data)
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
export const deleteSubjectbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.subject/deleteSubjectbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_SUBJECT, all_subject: response.data })
    } else {
      props.showErrorMessage(response.data)
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
export const getKec = (socket, cb) => dispatch => {
  socket.emit('api.master_tabel.kec/getKec',(response) => {
    if (response.type === 'ok') {
      cb&&cb()
      return dispatch({ type: actionTypes.SET_MASTER_KEC, all_kec: response.data, all_kec_monitoring: response.dataForMonitoring?response.dataForMonitoring:[] })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_KEC, all_kec: [] })
    }
  })
}
export const deleteKecbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.kec/deleteKecbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_KEC, all_kec: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const deleteTableDatabyId = (socket, input, props, cb) => dispatch => {
  socket.emit('api.master_tabel.kec/deleteTableDatabyId', input, (response) => {
    if (response.type === 'ok') {
      cb&&cb()
      props.showSuccessMessage(response.data)
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanKec = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.kec/simpanKec', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_KEC, all_kec: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const setIsApprove = (socket, input, props, cb) => dispatch => {
  socket.emit('api.master_tabel.kec/setIsApprove', input, (response) => {
    if (response.type === 'ok') {
      cb&&cb()
      props.showSuccessMessage(response.data)
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const getDeskel = (socket) => dispatch => {
  socket.emit('api.master_tabel.deskel/getDeskel',(response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_DESKEL, all_deskel: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_DESKEL, all_deskel: [] })
    }
  })
}
export const deleteDeskelbyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.deskel/deleteDeskelbyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_DESKEL, all_deskel: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanDeskel = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.deskel/simpanDeskel', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_DESKEL, all_deskel: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const getVariable = (socket) => dispatch => {
  socket.emit('api.master_tabel.variable/getVariable',(response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_VARIABLE, all_variable: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_VARIABLE, all_variable: [] })
    }
  })
}
export const deleteVariablebyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.variable/deleteVariablebyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_VARIABLE, all_variable: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanVariable = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.variable/simpanVariable', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_VARIABLE, all_variable: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const getTable = (socket) => dispatch => {
  socket.emit('api.master_tabel.table/getTable',(response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_TABLE, all_table: response.data })
    } else {
      return dispatch({ type: actionTypes.SET_MASTER_TABLE, all_table: [] })
    }
  })
}
export const deleteTablebyId = (socket, _id, props) => dispatch => {
  socket.emit('api.master_tabel.table/deleteTablebyId', _id, (response) => {
    if (response.type === 'ok') {
      return dispatch({ type: actionTypes.SET_MASTER_TABLE, all_table: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanTable = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.table/simpanTable', data, (response) => {
    if (response.type === 'ok') {
      response.additionalMsg && props.showSuccessMessage(response.additionalMsg)
      cb && cb()
      return dispatch({ type: actionTypes.SET_MASTER_TABLE, all_table: response.data })
    } else {
      props.showErrorMessage(response.data)
    }
  })
}
export const simpanData = (socket, data, props, cb) => dispatch => {
  socket.emit('api.master_tabel.kec/simpanData', data, (response) => {
    if (response.type === 'ok') {
      response.data && props.showSuccessMessage(response.data)
      cb && cb()
    } else {
      props.showErrorMessage(response.data)
    }
  })
}