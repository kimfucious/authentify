import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ children, ...rest }) => {
  const { username } = useSelector((state) => state.auth);
  const isAuthenticated = !!username;
  console.log("🦜 Private route says isAuthenticated: ", isAuthenticated);
  console.log(
    isAuthenticated
      ? "🎯 Private should render private page"
      : "⛔ Private route should redirect to sign in page"
  );
  console.log("Why does this run twice?!");
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
