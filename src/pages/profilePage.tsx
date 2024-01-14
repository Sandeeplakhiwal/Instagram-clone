import { Suspense, useEffect, useState } from "react";
import Header from "../components/header";
import Post from "../components/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { followUserApi, getUserPostsApi, getUserProfileApi } from "../apis";
import { WhiteLittleLoader } from "../components/littleLoader";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AppFallback from "../components/appFallback";
import ZigZagLoader from "../components/zigZagLoader";
import toast from "react-hot-toast";
import { RootState } from "../redux/store";
import { User } from "../redux/slices/userSlice";
import { isAxiosError } from "axios";
import { PostTypes } from "../components/timeline";

function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  type RouteParams = {
    id: string;
  };

  // Inside your component
  const { id } = useParams<RouteParams>();

  useEffect(() => {
    document.title = user ? user.name : "";
  });

  const isFollowing = (userId: string): boolean => {
    let check = -1;
    if (user) {
      user.following.forEach((item: User, index: number) => {
        if (item._id.toString() === userId.toString()) {
          check = index;
        }
      });
      return check !== -1;
    }
    return false;
  };

  const {
    data: userProfileData,
    isSuccess: userProfileSucces,
    isLoading: userProfileLoading,
  } = useQuery({
    queryKey: ["user-profile", id ? id : ""],
    queryFn: getUserProfileApi,
  });

  const {
    data: userPostsData,
    isSuccess: userPostsSuccess,
    isLoading: userPostsLoading,
  } = useQuery({
    queryKey: ["user-posts", id ? id : ""],
    queryFn: getUserPostsApi,
  });

  const handleFollowBtn = () => {
    followUserRefetch();
  };

  const {
    data: followUserData,
    refetch: followUserRefetch,
    error: followUserError,
    isSuccess: followUserSuccess,
    isLoading: followUserLoading,
  } = useQuery({
    queryKey: ["Follow-user", id ? id : ""],
    queryFn: followUserApi,
    enabled: false,
  });

  useEffect(() => {
    if (followUserSuccess && followUserData) {
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
      queryClient.refetchQueries({
        queryKey: ["user-profile"],
      });
      queryClient.invalidateQueries({ queryKey: ["postsOfFollowing"] });
    }
    if (followUserError) {
      if (
        isAxiosError(followUserError) &&
        followUserError?.message === "Network Error"
      ) {
        toast.error("Network error");
      }

      if (
        isAxiosError(followUserError) &&
        followUserError.response &&
        followUserError.response.data
      ) {
        const errorMessage = (
          followUserError.response.data as { message: string }
        ).message;
        toast.error(errorMessage);
      }
    }
  }, [followUserError, followUserSuccess, followUserData]);

  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    if (userProfileSucces && userProfileData) {
      setUserProfile(userProfileData?.data?.user);
    }
  }, [userProfileData, userProfileSucces]);

  useEffect(() => {
    if (userPostsSuccess && userPostsData) {
      setUserPosts(userPostsData?.data?.posts);
    }
  }, [userPostsSuccess, userPostsData]);

  function isSelfProfile(user: User | null | undefined, id: string) {
    return user?._id.toString() === id.toString();
  }

  return userProfileLoading === true ? (
    <AppFallback />
  ) : (
    <div>
      <Header />
      <div className="max-w-screen-md bg-white mx-auto p-4 min-h-screen">
        <div id="profile-header" className=" flex mx-auto gap-4 mb-16">
          <div className="  w-1/3 flex justify-center">
            <img
              src="/images/avatars/dali.jpg"
              alt="dali"
              className=" h-24 w-24 sm:h-32 sm:w-32 rounded-full"
            />
          </div>
          <div className=" w-2/3 flex flex-col px-0  sm:px-4 gap-4">
            <p className=" flex flex-row  w-full gap-2 sm:gap-8 items-end">
              <p className=" items-end">{userProfile && userProfile.name}</p>
              {isSelfProfile(user, id ? id : "") ? (
                <button className=" bg-[#efefef] rounded px-2 py-1 text-xs">
                  Edit profile
                </button>
              ) : null}
            </p>
            <p className=" flex flex-row  w-full gap-8">
              <p className=" font-semibold text-center">
                {userProfile?.post?.length}{" "}
                <span className=" font-normal">posts</span>
              </p>
              <p className=" font-semibold text-center">
                {userProfile?.followers?.length}{" "}
                <span className=" font-normal">followers</span>
              </p>
              <p className=" font-semibold text-center">
                {userProfile?.following?.length}{" "}
                <span className=" font-normal">following</span>
              </p>
            </p>
            {isSelfProfile(user, id ? id : "") ? null : (
              <button
                className=" w-full sm:w-28 py-1 rounded bg-blue-medium hover:bg-blue-500 text-white font-bold text-xs "
                onClick={handleFollowBtn}
              >
                {followUserLoading ? (
                  <WhiteLittleLoader />
                ) : isFollowing(id ? id : "") ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>
        </div>
        <div id="post-section" className=" grid grid-cols-1 mt-8">
          {userPostsLoading && <ZigZagLoader />}
          {userPosts.length === 0 ? (
            <p className=" text-center">No posts yet!</p>
          ) : (
            userPosts.map((post: PostTypes) => (
              <Suspense>
                <Post
                  key={post._id}
                  image={post?.image}
                  caption={post?.caption}
                  owner={post?.owner}
                  likes={post?.likes}
                  comments={post?.comments}
                  postId={post?._id}
                  postDate={post?.createdAt}
                />
              </Suspense>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
