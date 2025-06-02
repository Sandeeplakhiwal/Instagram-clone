import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD, LOGIN } from "../constants/routes";
import { useFormik } from "formik";
import { signupSchema } from "../schema";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/slices/userSlice";

function SignupPage() {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      console.log("Submit", values);
    },
  });

  console.log("Values", formik.values);
  console.log("Errors", formik.errors);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Hello Wordl", formik.values);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/create-user",
        formik.values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response", data);
      dispatch(loadUser(data?.user || null));

      console.log("Harsh");
      toast.success("Account created successfully");
      navigate(DASHBOARD);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log("ERROR", error);
    }
    // formik.handleSubmit();
  };

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex justify-center w-0 sm:w-3/5 h-4/5 invisible sm:visible">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iphone with profile img"
          className=" object-contain"
        />
      </div>
      <div className="flex flex-col mx-auto w-4/5 sm:w-2/5 ">
        <div className="bg-white flex flex-col items-center p-4 pb-4 border border-gray-primary mb-4">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="instagram"
              className="mt-2 w-1/2 mb-4"
            />
          </h1>
          <form onSubmit={handleSubmit} typeof="submit">
            <input
              aria-label="Enter Username"
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              placeholder="Username"
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-1 rounded "
            />
            {formik.dirty && formik.errors.name && formik.touched.name && (
              <p className=" text-red-primary text-xs mb-2">
                {formik.errors.name}
              </p>
            )}
            <input
              aria-label="Enter your email address"
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              placeholder="Email address"
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-1 rounded "
            />
            {formik.dirty && formik.errors.email && formik.touched.email && (
              <p className="text-red-primary text-xs mb-2">
                {formik.errors.email}
              </p>
            )}
            <input
              aria-label="Enter your password"
              type="password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              placeholder="Password"
              className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-2 rounded "
            />

            {formik.dirty &&
              formik.errors.password &&
              formik.touched.password && (
                <p className="text-red-primary text-xs mb-2">
                  {formik.errors.password}
                </p>
              )}

            <button
              type="submit"
              className={`bg-blue-medium text-white my-2 w-full rounded h-8 font-bold 
              `}
            >
              {"Sign Up"}
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
