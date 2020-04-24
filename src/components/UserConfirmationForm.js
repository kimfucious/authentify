import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Auth } from "aws-amplify";
import { compact, pick } from "lodash";
import { Button } from "../components/shared/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { confirmationSchema } from "../helpers";
import StatusMessage from "./shared/StatusMessage";

export const UserConfirmationForm = ({
  confirmationUsername,
  setConfirmationUsername,
  formStatus,
  setFormAction,
  setFormStatus
}) => {
  const dispatch = useDispatch();

  const [isCodeSent, setIsCodeSent] = useState(false);

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
      {/* <div className="display mb-3" style={{ fontSize: "24px" }}>
        Sign in
      </div> */}
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
            subtitle="Use the verification code to finish signing up"
            emoticon="📬"
          />
          <div className="mb-3" />
          <Formik
            initialValues={{
              code: "",
              username: confirmationUsername
            }}
            validationSchema={confirmationSchema}
            onSubmit={async (values, { setSubmitting }) => {
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
                dispatch({ type: "COGNITO_USER_SIGNUP_FAIL", payload: error });
                console.warn(error.response || error);
              }
            }}
          >
            {({ errors, values, isSubmitting }) => {
              const getDisabled = () => {
                const errs = !!compact(Object.values(errors)).length;
                const vals = !!compact(pick(values, "username", "code")).length;
                return errs && vals && isSubmitting;
              };
              return (
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
                        <ErrorMessage
                          name="code"
                          id="codeHelp"
                          className="text-danger"
                        />
                      </div>
                    ) : (
                      <small className="fieldHelperText" id="accessCodeHelp">
                        Check your inbox
                      </small>
                    )}
                  </div>
                  <Button
                    btnText="Confirm Signup"
                    className="my-3"
                    color="secondary"
                    isDisabled={getDisabled()}
                    isSpinning={isSubmitting}
                    fn={() => {}}
                    icon="password"
                    height={44}
                    type="submit"
                    width={240}
                  />
                  {isCodeSent ? (
                    <div className="font-weight-bold text-success">
                      Code has been resent!
                    </div>
                  ) : (
                    <Button
                      btnText={<small>Resend Verification Code</small>}
                      className="my-3"
                      color="light"
                      isSpinning={isSubmitting}
                      link
                      fn={() => {
                        handleResendCode();
                      }}
                      height={44}
                      // type="submit"
                      width={240}
                    />
                  )}
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </div>
  );
};
