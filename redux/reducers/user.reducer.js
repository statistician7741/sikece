import * as actionTypes from "../types/user.type";

export default (
  state = {
    active_user: {},
    penyDataCount: undefined,
    tahun_buku_monitoring: undefined,
    all_user: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_USER:
      return {
        ...state,
        active_user: action.active_user,
        penyDataCount: action.penyDataCount,
        tahun_buku_monitoring: action.tahun_buku_monitoring
      }
    case actionTypes.SET_ALL_USER:
      return {
        ...state,
        all_user: action.all_user
      }
    default: return state
  }
};
