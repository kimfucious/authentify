import React from "react";

const StatusMessage = ({ animation, emoticon, title, subtitle }) => {
  return (
    <div className="d-flex flex-column align-items-center text-center slug-width animated fadeIn mt-3">
      <div className="d-block d-sm-none display mb-3" style={{ fontSize: 72 }}>
        <span role="img" aria-label="some emoticon">
          {emoticon}
        </span>
      </div>
      <div className="d-none d-sm-block display mb-3" style={{ fontSize: 96 }}>
        <span role="img" aria-label="some emoticon">
          {emoticon}
        </span>
      </div>
      <p
        className={`d-flex d-sm-none lead mb-0 ${
          animation ? `animated ${animation}` : ""
        }`}
        style={{ fontSize: "36px" }}
      >
        {title}
      </p>
      <p
        className={`d-none d-sm-flex lead mb-0 ${
          animation ? `animated ${animation}` : ""
        }`}
        style={{ fontSize: "42px" }}
      >
        {title}
      </p>
      {subtitle ? (
        <>
          <p
            className="d-flex d-sm-none lead mt-0"
            style={{ fontSize: "18px" }}
          >
            {subtitle}
          </p>
          <p
            className="d-none d-sm-flex lead mt-0"
            style={{ fontSize: "24px" }}
          >
            {subtitle}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default StatusMessage;
