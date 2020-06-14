import * as actionTypes from "../types/user.type";

export default (
  state = {
    active_user: {},
    users_all: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_USER:
      return {
        ...state,
        active_user: action.active_user
      }
    default: return state
  }
};
