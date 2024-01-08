import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import * as PageRoutes from "./constants/routes.ts";
import { Toaster } from "react-hot-toast";
import UseAuthListener from "./hooks/useAuthListener.tsx";

const Login = lazy(() => import("./pages/LoginPage.tsx"));
const SignUp = lazy(() => import("./pages/SignupPage.tsx"));
const NotFound = lazy(() => import("./pages/not-found.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));

function App() {
  return (
    <Router>
      <UseAuthListener />
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path={PageRoutes.DASHBOARD} element={<Dashboard />} />
          <Route path={PageRoutes.LOGIN} element={<Login />} />
          <Route path={PageRoutes.SIGN_UP} element={<SignUp />} />
          <Route path={PageRoutes.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
