import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/shared/Button";
import { signOutCognitoUser } from "../actions/authActions";
import { UserInfoList } from "../components/UserInfoList";

export const Home = () => {
  const imageSize = "150px";
  const dispatch = useDispatch();

  const {
    auth,
    auth: { pictureUrl },
  } = useSelector(state => state);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5 animated fadeIn">
      <div className="mb-0">
        {!pictureUrl ? (
          <span
            role="img"
            aria-label="Person Tipping Hand"
            style={{ fontSize: imageSize }}
          >
            🤖
          </span>
        ) : (
          <img
            alt="user avatar"
            src={pictureUrl}
            style={{
              borderRadius: "50%",
              height: imageSize,
              width: imageSize,
              marginBottom: "1rem",
            }}
          />
        )}
      </div>
      <div className="display-4 text-light mb-3">User Details</div>
      <div className="lead text-light mb-4">
        Here's the droid you're looking for
      </div>
      <UserInfoList userInfo={auth} />
      <Button
        btnText="Sign Out"
        color="danger"
        fn={() => dispatch(signOutCognitoUser())}
        size="sm"
      />
    </div>
  );
};

export default Home;
