import * as actionTypes from "../types/master.type";

export default (
  state = {
    all_indicators: [],
    all_bab: [],
    all_subject: [],
    all_satuan: [],
    all_tables: [],
    all_kab: [],
    all_kec: [],
    all_deskel: [],
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
    default: return state
  }
};
