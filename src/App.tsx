import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import * as PageRoutes from "./constants/routes.ts";
import { Toaster } from "react-hot-toast";
import RunningBorder from "./components/runningBorder.tsx";
import AppFallback from "./components/appFallback.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "./apis/index.ts";
import { loadUser } from "./redux/slices/userSlice.ts";
import { RootState } from "./redux/store.ts";
import Backup from "./utils/backup.tsx";

const Login = lazy(() => import("./pages/LoginPage.tsx"));
const SignUp = lazy(() => import("./pages/SignupPage.tsx"));
const NotFound = lazy(() => import("./pages/not-found.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const Search = lazy(() => import("./pages/searchPage.tsx"));
const Inbox = lazy(() => import("./pages/inbox.tsx"));
const DirectMessage = lazy(() => import("./pages/direct.tsx"));
const Profile = lazy(() => import("./pages/profilePage.tsx"));
const EditProfile = lazy(() => import("./pages/editProfile.tsx"));
const CallPage = lazy(() => import("./pages/callPage.tsx"));

function App() {
  const dispatch = useDispatch();
  const {
    data: authData,
    isSuccess,
    isLoading: authLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authApi,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  useEffect(() => {
    if (authData && isSuccess) {
      dispatch(loadUser(authData?.data?.user));
    }
  }, [authData, isSuccess]);

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return authLoading ? (
    <AppFallback />
  ) : (
    <Router>
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route
            path={PageRoutes.DASHBOARD}
            element={isAuthenticated ? <Dashboard /> : <Login />}
          />
          <Route path={PageRoutes.LOGIN} element={<Login />} />
          <Route path={PageRoutes.SIGN_UP} element={<SignUp />} />
          <Route
            path={PageRoutes.SEARCH}
            element={isAuthenticated ? <Search /> : <Login />}
          />
          <Route
            path={PageRoutes.INBOX}
            element={isAuthenticated ? <Inbox /> : <Login />}
          />
          <Route
            path={PageRoutes.DIRECT}
            element={isAuthenticated ? <DirectMessage /> : <Login />}
          />
          <Route
            path={PageRoutes.CALL}
            element={isAuthenticated ? <CallPage /> : <Login />}
          />
          <Route
            path={PageRoutes.PROFILE}
            element={isAuthenticated ? <Profile /> : <Login />}
          />
          <Route
            path={PageRoutes.EDIT_PROFILE}
            element={isAuthenticated ? <EditProfile /> : <Login />}
          />
          <Route path={PageRoutes.NOT_FOUND} element={<NotFound />} />
          <Route path="test" element={<RunningBorder />} />
        </Routes>
      </Suspense>
      <Toaster position={"bottom-center"} />
      <Backup />
    </Router>
  );
}

export default App;
