import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { customHistory as history } from "./router/AppRouter";
import Amplify, { Auth, Hub } from "aws-amplify";
import * as serviceWorker from "./serviceWorker";
import "./styles/custom.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import awsconfig from "./aws-exports";
import configureStore from "./store/configureStore";
import { signInCognitoUser } from "./actions";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

const handleSignin = async (userInfo) => {
  try {
    if (!userInfo) {
      userInfo = await Auth.currentAuthenticatedUser();
    }
    console.log("🚚 Dispatching user data to Redux...");
    store.dispatch(signInCognitoUser(userInfo));
  } catch (error) {
    console.warn(error);
  }
};
Hub.listen("auth", async (data) => {
  console.log("🎟️ HUB EVENT/PAYLOAD", data.payload.event, data.payload);
  switch (data.payload.event) {
    case "configured":
      try {
        if (history.location.pathname.includes("auth-callback")) {
          console.log("🔍 AuthCallback detected!");
        } else {
          const userInfo = await Auth.currentAuthenticatedUser();
          console.log("✔️ User is already signed in", userInfo);
          if (history.location.pathname === "/") {
            console.log("🚦 User coming from sign in. Pushing to loading...");
            history.push("/loading");
          }
          handleSignin(userInfo);
        }
      } catch (error) {
        if (error === "not authenticated") {
          console.log("👮 User is not signed in");
        } else {
          console.warn("💣 Error in Hub:", error);
        }
        // Auth.currentAuthenticatedUser() throws an error if not signed in
        // We don't push from here as the redirect will be handled by protected routing
      }
      break;
    case "signIn":
      handleSignin();
      break;
    case "signIn_failure":
      store.dispatch({
        type: "CONGNITO_USER_SIGNIN_FAIL",
        payload: new Error(
          data.payload.data.message.split("PreSignUp failed with error")[1]
        )
      });
      break;
    case "signUp_failure":
      const errorMessage = data.payload.data.message.includes(
        "PreSignUp failed with error"
      )
        ? data.payload.data.message
            .split("PreSignUp failed with error")[1]
            .slice(1)
        : data.payload.data.message;

      store.dispatch({
        type: "COGNITO_USER_SIGNUP_FAIL",
        payload: new Error(errorMessage)
      });
      break;
    default:
      break;
  }
});

Amplify.configure(awsconfig);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
