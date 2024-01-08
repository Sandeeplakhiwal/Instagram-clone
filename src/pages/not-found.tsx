import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFound() {
  useEffect(() => {
    document.title = "Page not found - Instagram";
  }, []);
  return (
    <div className="bg-gray-background">
      <div className="mx-auth max-w-screen-xl pt-10 pb-5 pl-2 pr-2 ">
        <h3 className="text-center text-2xl">
          Sorry this page is not available
        </h3>
        <p className="text-center text-1xl">
          The link you followed may be broken, or the page may have been
          removed. Go back to <Link to={"/"}>Instagram</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
