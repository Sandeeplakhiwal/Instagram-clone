import { useFormik } from "formik";
import { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../apis";
import toast from "react-hot-toast";
import { DASHBOARD } from "../constants/routes";

function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login - Instagram";
  });

  interface loginCredentials {
    email: string;
    password: string;
  }

  const initialValues: loginCredentials = {
    email: "",
    password: "",
  };

  const queryClient = useQueryClient();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(DASHBOARD);
      toast.success("Logged in successfully");
    },
    onError: () => {
      if (error && error.message === "Network Error") {
        toast.error("Network Error");
      }
      if (error && error.message !== "Network Error") {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        console.log(values);
        mutateAsync(values);
        action.resetForm();
      },
    });

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    console.log("Submitted");
    handleSubmit();
  }

  console.log(data);
  console.log(error);
  console.log(errors);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iphone with profile img"
        />
      </div>
      <div className="flex flex-col w-2/5 ">
        <div className="bg-white flex flex-col items-center p-4 pb-4 border border-gray-primary mb-4">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="instagram"
              className="mt-2 w-1/2 mb-4"
            />
          </h1>
          <form method="POST">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-1 rounded "
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-2 rounded "
            />
            {(errors.email || errors.password) &&
            (touched.email || touched.password) ? (
              <p className="text-red-primary mb-1 text-xs">
                *{errors.email || errors.password}
              </p>
            ) : null}
            <button
              type="submit"
              className={`bg-blue-medium text-white my-2 w-full rounded h-8 font-bold ${
                errors.email || errors.password ? "opacity-50" : ""
              }`}
              onClick={(e) => submitHandler(e)}
            >
              {isPending ? "Loading.." : "Log In"}
            </button>
          </form>
        </div>
        <div className="flex flex-col p-4 justify-center items-center w-full rounded border border-gray-primary bg-white">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to={"/signup"}
              className="text-blue-medium hover:underline-offset-4 hover:underline"
            >
              register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// Todo: add to tailwind.config
// border-gray-primary
// text-gray-base
// bg-blue-medium
