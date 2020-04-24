import { Auth } from "aws-amplify";

export const handleCognitoSignUpError = (userInfo) => async (dispatch) => {};

export const signInCognitoUser = (userInfo) => async (dispatch) => {
  // console.warn(await Auth.currentAuthenticatedUser({ bypassCache: true }));
  console.warn("USERINFO", userInfo);
  dispatch({ type: "SIGN_IN_START" });
  try {
    const payload = {
      appleEmail: userInfo.attributes["custom:appleEmail"],
      email: userInfo.attributes.email,
      givenName: userInfo.attributes.given_name,
      fullName: userInfo.attributes.name,
      googleEmail: userInfo.attributes["custom:googleEmail"],
      familyName: userInfo.attributes.family_name,
      pictureUrl: userInfo.attributes.picture,
      userId: userInfo.attributes.sub,
      username: userInfo.username
    };
    if (userInfo.username.includes("Google")) {
    }
    dispatch({ type: "SIGN_IN_SUCCESS", payload });
  } catch (error) {
    dispatch({ type: "SIGN_IN_FAIL" });
    console.error(error);
  }
};

export const signOutCognitoUser = () => async (dispatch) => {
  dispatch({ type: "SIGN_OUT_START" });
  try {
    await Auth.signOut();
    // "SIGN_OUT_SUCCESS" is in ../reducers/index.js
    // It clears state on sign out
    dispatch({ type: "SIGN_OUT_SUCCESS" });
  } catch (error) {
    dispatch({ type: "SIGN_OUT_FAIL" });
    console.error(error);
  }
};
