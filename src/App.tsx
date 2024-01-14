import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import * as PageRoutes from "./constants/routes.ts";
import { Toaster } from "react-hot-toast";
import UseAuthListener from "./hooks/useAuthListener.tsx";
import RunningBorder from "./components/runningBorder.tsx";
import AppFallback from "./components/appFallback.tsx";

const Login = lazy(() => import("./pages/LoginPage.tsx"));
const SignUp = lazy(() => import("./pages/SignupPage.tsx"));
const NotFound = lazy(() => import("./pages/not-found.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const Search = lazy(() => import("./pages/searchPage.tsx"));
const Profile = lazy(() => import("./pages/profilePage.tsx"));

function App() {
  return (
    <Router>
      <UseAuthListener />
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route path={PageRoutes.DASHBOARD} element={<Dashboard />} />
          <Route path={PageRoutes.LOGIN} element={<Login />} />
          <Route path={PageRoutes.SIGN_UP} element={<SignUp />} />
          <Route path={PageRoutes.SEARCH} element={<Search />} />
          <Route path={PageRoutes.PROFILE} element={<Profile />} />
          <Route path={PageRoutes.NOT_FOUND} element={<NotFound />} />
          <Route path="test" element={<RunningBorder />} />
        </Routes>
      </Suspense>
      <Toaster position={"bottom-center"} />
    </Router>
  );
}

export default App;
