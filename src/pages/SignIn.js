import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cognitoLogo from "../images/cognito_logo.png";
import { UserConfirmationForm } from "../components/UserConfirmationForm";
import { Alert } from "../components/shared/Alert";
import { getError } from "../selectors";
import { SignInForm } from "../components/SignInForm";

export const SignIn = () => {
  const errors = useSelector((state) => state.errors);
  const [error, setError] = useState({ title: "", message: "" });
  const [formAction, setFormAction] = useState("signIn");
  const [formStatus, setFormStatus] = useState("");
  const [confirmationUsername, setConfirmationUsername] = useState("");
  const [isSignInSpinning] = useState(false);
  const [isSignUpSpinning] = useState(false);
  const [passwordlessCognitoUser, setPasswordlessCognitoUser] = useState(null);

  useEffect(() => {
    const signUpError = getError(["COGNITO_USER_SIGNUP"], errors);
    console.warn(signUpError);
    if (signUpError) {
      setError({ title: "Sign Up Error", message: signUpError });
    } else setError({ title: "", message: "" });
  }, [errors]);

  const renderForm = () => {
    if (confirmationUsername) {
      return (
        <UserConfirmationForm
          confirmationUsername={confirmationUsername}
          setConfirmationUsername={setConfirmationUsername}
          formStatus={formStatus}
          passwordlessCognitoUser={passwordlessCognitoUser}
          setPasswordlessCognitoUser={setPasswordlessCognitoUser}
          setFormAction={setFormAction}
          setFormStatus={setFormStatus}
        />
      );
    } else {
      return (
        <SignInForm
          formAction={formAction}
          isSignInSpinning={isSignInSpinning}
          isSignUpSpinning={isSignUpSpinning}
          setConfirmationUsername={setConfirmationUsername}
          setFormAction={setFormAction}
          setPasswordlessCognitoUser={setPasswordlessCognitoUser}
        />
      );
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      {error.message ? (
        <Alert action="COGNITO_USER_SIGNUP" error={error} color="danger" />
      ) : null}
      {formAction === "signIn" && !passwordlessCognitoUser ? (
        <>
          <img
            src={cognitoLogo}
            alt="AWS Cognito Logo"
            height="200px"
            widht="200px"
          />
          <div className="display-4 mt-3 mb-2 text-light">Authentify</div>
          <div className="lead mb-5 text-light">
            A Cognito Federated Sign-in Demo
          </div>
        </>
      ) : !confirmationUsername ? (
        <>
          {!passwordlessCognitoUser ? (
            <div className="display-4 mt-3 mb-4 text-light">
              New User Sign Up
            </div>
          ) : null}
        </>
      ) : null}
      {renderForm()}
    </div>
  );
};
