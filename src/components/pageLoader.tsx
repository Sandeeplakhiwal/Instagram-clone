import { useState, useEffect, ReactNode } from "react";
import RunningBorder from "./runningBorder";

interface PageLoaderProps {
  children: ReactNode;
}

const PageLoader = ({ children }: PageLoaderProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <div className="relative">
      {loading && <RunningBorder />}
      {children}
    </div>
  );
};

export default PageLoader;
