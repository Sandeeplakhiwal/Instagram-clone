import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).max(20).required("Please enter your password"),
});

export const signupSchema = Yup.object({
  name: Yup.string().min(2).max(20).required("Please enter username"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).max(20).required("Please enter your password"),
});
