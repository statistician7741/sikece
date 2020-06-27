import { applyMiddleware, createStore } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

import reducer from "./reducers";

const middlewares = [promise, thunk];

if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`);

  middlewares.push(createLogger());
}

const middleware = applyMiddleware(...middlewares);

export const initStore = () => {
  return createStore(
    reducer,
    middleware
  );
};