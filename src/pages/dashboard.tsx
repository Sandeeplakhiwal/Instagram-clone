import { useEffect } from "react";
import TimeLine from "../components/timeline";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

function Dashboard() {
  useEffect(() => {
    document.title = "Instagram";
  }, []);
  return (
    <>
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <TimeLine />
        <Sidebar />
      </div>
    </>
  );
}

export default Dashboard;
