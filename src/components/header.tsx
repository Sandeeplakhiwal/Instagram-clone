import { Link, useNavigate } from "react-router-dom";
import * as PageRoutes from "../constants/routes";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removeUser } from "../redux/slices/userSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../apis";
import { RootState } from "../redux/store";

function Header() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  console.log(isAuthenticated, user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { refetch: logoutRefetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutApi,
    enabled: false,
  });

  const handleLogout = async () => {
    try {
      await logoutRefetch();
      dispatch(removeUser());
      queryClient.resetQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully");
      navigate(PageRoutes.LOGIN);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-primary mb-2 sticky top-0">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between w-full h-full">
          <div className="text-gray-700 text-center flex items-center align-middle cursor-pointer">
            <h1>
              <Link to={PageRoutes.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="Instagram"
                  className="mt-2 w-6/12"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 textcenter flex items-center align-middle">
            {isAuthenticated ? (
              <>
                <Link to={PageRoutes.DASHBOARD} className=" mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Link>
                <Link to={PageRoutes.SEARCH} className=" mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </Link>
                <button
                  type="button"
                  title="Sign Out"
                  onClick={handleLogout}
                  className="w-9 text-center pl-0.5 mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>
                </button>
                {user && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${user?.name}/${user?._id}`}>
                      <img
                        src={
                          user?.avatar
                            ? user.avatar.url
                            : "/images/avatars/default.png"
                        }
                        alt="avatar"
                        className="rounded-full h-8 w-8 flex"
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={PageRoutes.LOGIN}>
                  <button
                    className=" bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 text-center"
                    title="Log In"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={PageRoutes.SIGN_UP}>
                  <button
                    title="Sign Up"
                    className=" font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
