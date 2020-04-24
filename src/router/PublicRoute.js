import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ children, ...rest }) => {
  const { username } = useSelector((state) => state.auth);
  const isAuthenticated = !!username;
  console.log("🦜 Public route says isAuthenticated: ", isAuthenticated);
  console.log(
    isAuthenticated
      ? "⛔ Public route should redirect to home"
      : "🎯 Public route should render public page"
  );
  console.log("Why does this run twice?!");
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
