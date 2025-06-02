import { Link } from "react-router-dom";
import PageLoader from "../components/pageLoader";
import { useFormik } from "formik";
import axios, { AxiosHeaders } from "axios";
import { LOGIN } from "../constants/routes";
import { loginSchema } from "../schema";

function LoginPage() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log("values", values);
    },
  });
  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    // formik.handleSubmit();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/login",
        formik.values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("res", data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  console.log("formik", formik.values);

  return (
    <PageLoader>
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
            <form method="POST">
              <input
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                aria-label="Enter your email address"
                type="text"
                placeholder="Email address"
                className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-1 rounded "
              />
              <input
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                aria-label="Enter your password"
                type="password"
                placeholder="Password"
                className="text-sm text-gray-base w-full my-3 py-5 px-4 h-2 border border-gray-primary mb-2 rounded "
              />

              <button
                type="submit"
                onClick={() => handleSubmit}
                className={`bg-blue-medium text-white my-2 w-full rounded h-8 font-bold `}
              >
                {"Log In"}
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
    </PageLoader>
  );
}

export default LoginPage;

// Todo: add to tailwind.config
// border-gray-primary
// text-gray-base
// bg-blue-medium
