import counterReducer from "./counter";
import accountReducer from "./account";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
});

export default rootReducer;
