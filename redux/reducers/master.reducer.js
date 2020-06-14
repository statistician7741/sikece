import * as actionTypes from "../types/master.type";

export default (
  state = {
    all_indicators: [],
    all_bab: [],
    all_tables: [],
    all_kec: [],
    all_kab: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_MASTER_KAB:
      return {
        ...state,
        all_kab: action.all_kab
      }
    default: return state
  }
};
