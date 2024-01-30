import { CURRENT_ACCOUNT } from "../actions/account";

const accountReducer = (state = { account: "" }, action) => {
  switch (action.type) {
    case CURRENT_ACCOUNT:
      return { ...state, account: state.account };
    default:
      return { ...state };
  }
};

export default accountReducer;
