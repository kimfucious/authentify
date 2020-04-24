import * as Yup from "yup";

export const trimText = (len, text) => {
  if (text && text.length <= len) return text;
  return text.slice(0, len - 3) + "...";
};

export const confirmationSchema = Yup.object({
  code: Yup.string()
    .length(6, "Must be at least exactly 6 characters")
    .required("Required"),
  username: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(15, "Must be 15 characters or less")
    .required("Required")
});
export const signInSchema = Yup.object({
  username: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(15, "Must be 15 characters or less")
    .required("Required")
});
export const signUpSchema = Yup.object({
  accessCode: Yup.string().length(22, "Must be at least exactly 22 characters"),
  // .required("Required"),
  appleEmail: Yup.string().email("Invalid email address"),
  email: Yup.string().email("Invalid email address").required("Required"),
  googleEmail: Yup.string().email("Invalid email address"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  username: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(15, "Must be 15 characters or less")
    .required("Required")
});
