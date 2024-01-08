import { useFormik } from "formik";
import { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupApi } from "../apis";
import toast from "react-hot-toast";
import { DASHBOARD, LOGIN } from "../constants/routes";

function SignupPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Signup - Instagram";
  });

  interface SignupCredentials {
    name: string;
    email: string;
    password: string;
  }

  const initialValues: SignupCredentials = {
    name: "",
    email: "",
    password: "",
  };

  const queryClient = useQueryClient();

  let { data, error, isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: async (values, action) => {
        mutateAsync(values);
        action.resetForm();
      },
    });

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  useEffect(() => {
    if (data && isSuccess) {
      toast.success("Registered successfully");
      navigate(DASHBOARD);
    }
    if (error && error.message === "Network Error") {
      toast.error("Network Error");
      error = null;
    }
    if (error && error.message !== "Network Error") {
      toast.error(error?.response?.data?.message);
      error = null;
    }
  }, [isSuccess, error, data]);

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
              aria-label="Enter Username"
              type="text"
              placeholder="Username"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-1 rounded "
            />
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
            {(errors.name || errors.email || errors.password) &&
            (touched.name || touched.email || touched.password) ? (
              <p className="text-red-primary mb-1 text-xs">
                *{errors.name || errors.email || errors.password}
              </p>
            ) : null}
            <button
              type="submit"
              className={`bg-blue-medium text-white my-2 w-full rounded h-8 font-bold ${
                errors.name || errors.email || errors.password
                  ? "opacity-50"
                  : ""
              }`}
              onClick={(e) => submitHandler(e)}
            >
              {isPending ? "Loading" : "Sign Up"}
            </button>
          </form>
        </div>
        <div className="flex justify-center text-center items-center flex-col w-full bg-white rounded p-4 border border-gray-primary">
          <p>
            Already have an account?{" "}
            <Link
              to={LOGIN}
              className="text-blue-medium hover:underline-offset-4 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
