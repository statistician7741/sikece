import * as actionTypes from "../types/master.type";

export default (
  state = {
    all_bab: [],
    all_subject: [],
    all_satuan: [],
    all_kab: [],
    all_kab_obj: {},
    all_kec: [],
    all_kec_obj: {},
    all_kec_table_obj: {},
    all_deskel: [],
    all_variable: [],
    all_variable_obj: {},
    all_table: [],
    all_table_obj: {},
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_MASTER_KAB:
      let all_kab_obj = {}
      if (action.all_kab.length) {
        action.all_kab.forEach(v => {
          all_kab_obj[v._id] = v
        });
      }
      return {
        ...state,
        all_kab: action.all_kab,
        all_kab_obj
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
      let all_kec_obj = {}
      let all_kec_table_obj = {}
      if (action.all_kec.length) {
        action.all_kec.forEach(v => {
          all_kec_obj[v._id] = v
          all_kec_table_obj[v._id] = {}
          if(v.table){
            v.table.forEach(w => {
              all_kec_table_obj[v._id][w._idTable] = w
            });
          }
        });
      }
      return {
        ...state,
        all_kec: action.all_kec,
        all_kec_obj,
        all_kec_table_obj
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
