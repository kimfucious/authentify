export default (state = {}, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
