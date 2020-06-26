import { applyMiddleware, createStore } from "redux";
// import { createLogger } from "redux-logger";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

import reducer from "./reducers";

const middlewares = [promise, thunk];

if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`);

  middlewares.push(createLogger());
}
// const store = compose(applyMiddleware(...middlewares))(createStore)(reducer);

const middleware = applyMiddleware(...middlewares);

export const initStore = () => {
  return createStore(
    reducer,
    middleware
  );
};