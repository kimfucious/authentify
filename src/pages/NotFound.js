import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "../components/shared/Button";

export const NotFound = ({ history }) => {
  const { username } = useSelector((state) => state.auth);
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div>
        <span role="img" aria-label="scream" style={{ fontSize: "200px" }}>
          😱
        </span>
      </div>
      <div className="display-4 text-light mb-3">Oh, nos!</div>
      <div className="lead text-light mb-4">
        The page you are looking for does not exist
      </div>
      <Button
        btnText={username ? "Home" : "Sign in"}
        color="secondary"
        fn={() => history.push("/home")}
        size="sm"
      />
    </div>
  );
};

export default withRouter(NotFound);
