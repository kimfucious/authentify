import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Formik } from "formik";
import { signUpSchema } from "../validators";
import { SignInForm } from "./SignInForm";

export const SignInFormik = ({
  formAction,
  setFormAction,
  setFormStatus,
  setConfirmationUsername
}) => {
  const [isSignInSpinning, setIsSignInSpinning] = useState(false);
  const [isSignUpSpinning, setIsSignUpSpinning] = useState(false);
  const [isAppleSignInSpinning, setIsAppleSignInSpinning] = useState(false);
  const [isGoogleSignInSpinning, setIsGoogleSignInSpinning] = useState(false);

  return (
    <div className="d-flex flex-column align-items-center">
      {/* <div className="display mb-3" style={{ fontSize: "24px" }}>
        Sign in
      </div> */}
      <Formik
        initialValues={{
          accessCode: "",
          appleEmail: "",
          googleEmail: "",
          email: "",
          password: "",
          username: ""
        }}
        validationSchema={signUpSchema}
        onSubmit={async (values, { setSubmitting: setIsSubmitting }) => {
          if (formAction === "signIn") {
            setIsSignInSpinning(true);
            setIsSubmitting(true);
            alert("I don't do anything yet");
            setIsSignInSpinning(false);
            setIsSubmitting(false);
            // const user = await Auth.signInWithoutPassword(values.username);
            // console.log("SIGN IN WITHOUT PASSWORD:", user);
          } else if (formAction === "signUp") {
            try {
              setIsSignUpSpinning(true);
              const cognitoUser = await Auth.signUp({
                username: values.username,
                password: values.password,
                attributes: {
                  email: values.email,
                  "custom:appleEmail": values.appleEmail,
                  "custom:googleEmail": values.googleEmail
                }
              });
              if (!cognitoUser.user.userConfirmed) {
                setConfirmationUsername(cognitoUser.user.username);
              }
              setIsSignUpSpinning(false);
              console.warn("Sign Up User: ", cognitoUser);
            } catch (error) {
              setIsSignUpSpinning(false);
              setIsSubmitting(false);
              console.warn(error.response || error);
            }
          }
        }}
      >
        <SignInForm
          formAction={formAction}
          isSignInSpinning={isSignInSpinning}
          isSignUpSpinning={isSignUpSpinning}
          setFormAction={setFormAction}
        />
      </Formik>
    </div>
  );
};
