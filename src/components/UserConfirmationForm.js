import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Auth } from "aws-amplify";
import { Button } from "../components/shared/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { confirmationSchema } from "../helpers";
import StatusMessage from "./shared/StatusMessage";

export const UserConfirmationForm = ({
  confirmationUsername,
  setConfirmationUsername,
  formStatus,
  passwordlessCognitoUser,
  setFormAction,
  setFormStatus,
  setPasswordlessCognitoUser
}) => {
  const dispatch = useDispatch();

  const [isCodeSent, setIsCodeSent] = useState(false);

  let sentCount = 0;
  const handleResendCode = async () => {
    try {
      await Auth.resendSignUp(confirmationUsername);
      setIsCodeSent(true);
    } catch (error) {
      dispatch({ type: "COGNITO_USER_SIGNUP_FAIL", payload: error });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {formStatus === "signUpSuccess" ? (
        <>
          <StatusMessage
            title="Success"
            subtitle="You have signed up!"
            emoticon="🎉"
          />
          <Button
            btnText="Sign in with New Account"
            className="my-3"
            color="success"
            fn={() => {
              setFormAction("signIn");
              setConfirmationUsername("");
            }}
            height={44}
            width={240}
          />
        </>
      ) : (
        <>
          <StatusMessage
            title="Check your inbox"
            subtitle={`Use the verification code to ${
              passwordlessCognitoUser ? "sign in" : "finish signing up"
            }`}
            emoticon="📬"
          />
          <div className="mb-3" />
          <Formik
            initialValues={{
              code: "",
              username: confirmationUsername
            }}
            validationSchema={confirmationSchema}
            onSubmit={async (
              values,
              { setSubmitting, setFieldError, resetForm }
            ) => {
              if (passwordlessCognitoUser) {
                try {
                  const result = await Auth.sendCustomChallengeAnswer(
                    passwordlessCognitoUser,
                    values.code
                  );
                  console.log("RESULT", result);
                  if (
                    result.challengeName &&
                    result.challengeName === "CUSTOM_CHALLENGE"
                  ) {
                    sentCount++;
                    console.log("SENT COUNT: ", sentCount);
                    if (sentCount > 0) {
                      setFieldError(
                        "code",
                        `Incorrect code. ${3 - sentCount} more ${
                          3 - sentCount === 1 ? "try" : "tries"
                        }.`
                      );
                    }
                  }
                } catch (error) {
                  console.warn(error);
                  setConfirmationUsername("");
                  setPasswordlessCognitoUser(null);
                  resetForm();
                }
              } else {
                try {
                  setSubmitting(true);
                  const data = await Auth.confirmSignUp(
                    values.username,
                    values.code
                  );
                  if (data === "SUCCESS") {
                    setFormStatus("signUpSuccess");
                  }
                  console.log("DATA: ", data);
                  // setSubmitting(false);
                } catch (error) {
                  setSubmitting(false);
                  dispatch({
                    type: "COGNITO_USER_SIGNUP_FAIL",
                    payload: error
                  });
                  console.warn(error.response || error);
                }
              }
            }}
          >
            {({ errors, values, isSubmitting, resetForm }) => (
              <Form className="d-flex flex-column align-items-center mb-3">
                <div className="d-flex flex-column form-group w-100">
                  <label htmlFor="codeInput">Verification Code</label>
                  <Field
                    aria-describedby="codeHelp"
                    className="form-control"
                    id="codeInput"
                    name="code"
                    placeholder="123456"
                    type="text"
                  />
                  {errors.code ? (
                    <div className="formikErrorMessage">
                      <ErrorMessage name="code" id="codeHelp" />
                    </div>
                  ) : (
                    <small className="fieldHelperText" id="codeHelp">
                      Check your inbox
                    </small>
                  )}
                </div>
                <Button
                  btnText={`Confirm ${
                    passwordlessCognitoUser ? "sign-in" : "sign-up"
                  } code`}
                  className="my-3"
                  color="secondary"
                  isDisabled={
                    !values.code ||
                    !values.username ||
                    errors.code ||
                    errors.username
                  }
                  isSpinning={isSubmitting}
                  fn={() => {}}
                  icon="password"
                  height={44}
                  type="submit"
                  width={240}
                />
                <Button
                  btnText={<small>Back to Sign-in Page</small>}
                  className="my-3"
                  color="light"
                  link
                  fn={() => {
                    setConfirmationUsername("");
                    setPasswordlessCognitoUser(null);
                    resetForm();
                  }}
                  type="button"
                />
                {isCodeSent ? (
                  <div className="font-weight-bold text-success">
                    Code has been resent!
                  </div>
                ) : !passwordlessCognitoUser ? (
                  <Button
                    btnText={<small>Resend Verification Code</small>}
                    className="my-3"
                    color="light"
                    isSpinning={isSubmitting}
                    link
                    fn={() => {
                      handleResendCode();
                    }}
                    type="button"
                  />
                ) : null}
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
