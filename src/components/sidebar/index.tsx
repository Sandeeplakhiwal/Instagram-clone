import { useSelector } from "react-redux";
import User from "./user";
import { useQuery } from "@tanstack/react-query";
import {
  getFollowSuggestionsApi,
  getPopularFollowSuggestionsApi,
} from "../../apis";
import { Suspense, lazy, useEffect } from "react";
import { RootState } from "../../redux/store";

const Suggestions = lazy(() => import("./suggestions"));

const Skeleton = () => {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Sidebar() {
  const { user } = useSelector((state: RootState) => state.user);
  const { data } = useQuery({
    queryKey: ["Suggestions-to-follow"],
    queryFn: getFollowSuggestionsApi,
  });
  const { data: popularSuggestionsData, refetch } = useQuery({
    queryKey: ["Popular-suggestions-to-follow"],
    queryFn: getPopularFollowSuggestionsApi,
    enabled: false,
  });
  useEffect(() => {
    if (
      user &&
      user.following &&
      user.following.length === 0 &&
      user.followers &&
      user.followers.length === 0
    ) {
      refetch();
    }
  }, [user, refetch]);

  return (
    <Suspense fallback={<Skeleton />}>
      <div className="p-4 invisible md:visible">
        <User
          username={user && user.name ? user.name.split(" ")[0] : ""}
          fullName={user ? user.name : ""}
          userId={user ? user._id : ""}
        />
        <Suggestions
          users={
            (user && user.following && user.following.length >= 1) ||
            (user && user.followers && user.followers.length >= 1)
              ? data?.data.users
              : popularSuggestionsData?.data?.users || []
          }
        />
      </div>
    </Suspense>
  );
}

export default Sidebar;
// data?.data.users
