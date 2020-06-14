import { combineReducers } from "redux";

import master from "./master.reducer";
import user from "./user.reducer";
import socket from "./socket.reducer";

export default combineReducers({
  master,
  user,
  socket
});
