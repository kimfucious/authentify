import React, { useEffect, useState } from "react";
import { Button } from "../components/shared/Button";
import { Loading } from "./Loading";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "qs";

export const AuthCallback = ({ location, history }) => {
  const { username } = useSelector((state) => state);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const { error_description } = qs.parse(location.search.slice(1));
    if (
      error_description &&
      error_description.includes("User does not exist with email")
    ) {
      setErrorMsg("You need an account before signing in with Google");
    } else {
      setErrorMsg(error_description);
    }
  }, [location]);

  const { error } = qs.parse(location.search);
  if (error && error.includes("cancelled")) {
    console.warn("User cancelled sign in");
    history.push("/");
    return null;
  } else if (!error) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div>
        <span role="img" aria-label="scream" style={{ fontSize: "200px" }}>
          {errorMsg.includes("You need an account") ? "👮🏽‍♀️" : "💣"}
        </span>
      </div>
      <div className="display-4 text-light mb-3">
        {errorMsg.includes("You need an account")
          ? "Not so fast"
          : "Something's not right"}
      </div>
      {errorMsg.includes("You need an account") ? (
        <div className="lead text-danger mb-4 font-weight-bold">{errorMsg}</div>
      ) : (
        <>
          <div className="lead text-light mb-3">Here's an error message:</div>
          <div className="lead text-danger mb-4 font-weight-bold">
            {errorMsg}
          </div>
        </>
      )}
      <Button
        btnText={username ? "Home" : "Back to Sign in"}
        color="secondary"
        fn={() => history.push("/home")}
        size="sm"
      />
    </div>
  );
};

export default withRouter(AuthCallback);
