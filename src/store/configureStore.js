import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import rootReducer from "../reducers";
import thunkMiddleware from "redux-thunk";

// TODO:  conditionally import packages based on env

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware, logger];
  if (process.env.NODE_ENV !== "development") {
    middlewares.pop();
  }
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  if (process.env.NODE_ENV !== "development") {
    enhancers.pop();
  }

  const composedEnhancers =
    process.env.NODE_ENV === "development"
      ? composeWithDevTools(...enhancers)
      : compose(...enhancers);

  return createStore(rootReducer, preloadedState, composedEnhancers);
}
