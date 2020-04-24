import React from "react";
import { trimText } from "../helpers";

export const UserInfoList = ({ userInfo }) => {
  const renderItems = () => {
    let items = Object.entries(userInfo);
    items = items.filter((item) => item[0] !== "pictureUrl");
    return items.map((item, index) => {
      if (!item[1]) {
        item[1] = "n/a";
      }

      return (
        <li className="list-group-item text-light" key={index}>
          <div className="d-flex justify-content-between">
            <div className="flex-fit w-25">{item[0]}:</div>
            <div className="flex-fit w-75">{trimText(43, item[1])}</div>
          </div>
        </li>
      );
    });
  };

  return (
    <ul
      className="list-group list-group-mine w-100 mb-4"
      style={{ maxWidth: "500px" }}
    >
      {renderItems()}
    </ul>
  );
};
