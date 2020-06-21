import * as actionTypes from "../types/master.type";

export default (
  state = {
    all_bab: [],
    all_subject: [],
    all_satuan: [],
    all_kab: [],
    all_kec: [],
    all_deskel: [],
    all_variable: [],
    all_variable_obj: {},
    all_table: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_MASTER_KAB:
      return {
        ...state,
        all_kab: action.all_kab
      }
    case actionTypes.SET_MASTER_BAB:
      return {
        ...state,
        all_bab: action.all_bab
      }
    case actionTypes.SET_MASTER_SATUAN:
      return {
        ...state,
        all_satuan: action.all_satuan
      }
    case actionTypes.SET_MASTER_SUBJECT:
      return {
        ...state,
        all_subject: action.all_subject
      }
    case actionTypes.SET_MASTER_KEC:
      return {
        ...state,
        all_kec: action.all_kec
      }
    case actionTypes.SET_MASTER_DESKEL:
      return {
        ...state,
        all_deskel: action.all_deskel
      }
    case actionTypes.SET_MASTER_VARIABLE:
      let all_variable_obj = {}
      if (action.all_variable.length) {
        action.all_variable.forEach(v => {
          all_variable_obj[v._id] = v
        });
      }
      return {
        ...state,
        all_variable: action.all_variable,
        all_variable_obj
      }
    case actionTypes.SET_MASTER_TABLE:
      return {
        ...state,
        all_table: action.all_table
      }
    default: return state
  }
};
