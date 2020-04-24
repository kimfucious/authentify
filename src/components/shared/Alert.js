import React from "react";
import { useDispatch } from "react-redux";

export const Alert = ({ action, color, error: { message, title } }) => {
  const dispatch = useDispatch();
  return (
    <div
      className={`d-flex justify-content-between alert alert-${color} alert-dismissible fade show`}
      role="alert"
    >
      <div>
        <strong>
          {title}:{"  "}
        </strong>
        {message}
      </div>
      <button
        type="button"
        className="close"
        onClick={() => {
          dispatch({ type: action + "_RESET" });
        }}
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};
