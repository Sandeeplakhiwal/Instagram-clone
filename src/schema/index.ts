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

export const updatePasswordSchema = Yup.object({
  oldPassword: Yup.string()
    .min(6)
    .max(20)
    .required("Please enter your old password"),
  newPassword: Yup.string()
    .min(6)
    .max(20)
    .required("Please enter new password"),
});

export const updateNameEmailSchema = Yup.object({
  newName: Yup.string().min(2).max(20),
  newEmail: Yup.string().email(),
});
