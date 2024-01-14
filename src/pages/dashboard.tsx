import { Suspense, lazy, useEffect, useState } from "react";
import TimeLine from "../components/timeline";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Modal from "../components/newPost/newPostModal";
import PageLoader from "../components/pageLoader";
const FloatingNewPostButton = lazy(
  () => import("../components/newPost/floatingNewPostButton")
);

function Dashboard() {
  useEffect(() => {
    document.title = "Instagram";
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <PageLoader>
        <Header />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <TimeLine />
          <Sidebar />
        </div>

        <Suspense>
          <FloatingNewPostButton modalOpenHandler={() => openModal()} />
          <Modal isOpen={isModalOpen} onClose={closeModal} />
        </Suspense>
      </PageLoader>
    </>
  );
}

export default Dashboard;

/*     <>
      <AppLoader>
        <Header />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        
        </div>
      </AppLoader>
    </> */
