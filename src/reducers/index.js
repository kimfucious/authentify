import { combineReducers } from "redux";
import auth from "./authReducer";
import errors from "./errorReducer";

export const appReducer = combineReducers({
  auth,
  errors
});

export const rootReducer = (state, action) => {
  if (action.type === "SIGN_OUT_SUCCESS") {
    console.log("Clearing Store on Sign Out");
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
