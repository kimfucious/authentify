export default (state = {}, action) => {
  const { type, payload } = action;
  const matches = /(.*)_(START|FAIL|RESET)/.exec(type);

  // not a *_START, *_FAIL actions, or *_RESET so ignore
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  if (requestState === "FAIL" && !payload) {
    throw new Error(
      `${requestName} FAIL dispatch is missing error payload in the catch clause.`
    );
  }
  switch (type) {
    case "COGNITO_USER_SIGNUP_RESET":
      return {
        ...state,
        COGNITO_USER_SIGNUP: ""
      };
    default:
      return {
        ...state,
        // Store errorMessage
        // e.g. stores errorMessage when receiving *_FAIL
        //      else clear errorMessage when receiving _START or _RESET
        [requestName]: requestState === "FAIL" ? payload.message : ""
      };
  }
};

// If you're seeing the following crash error,
// you've forgotten to add a payload to the FAIL dispatch

// Unhandled Rejection (TypeError): Cannot read property 'message' of undefined
