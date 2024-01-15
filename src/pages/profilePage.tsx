import { Suspense, useEffect, useState } from "react";
import Header from "../components/header";
import Post from "../components/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UseFollowUser,
  followUserApi,
  getUserFollowersApi,
  getUserFollowingsApi,
  getUserPostsApi,
  getUserProfileApi,
} from "../apis";
import LittleLoader, { WhiteLittleLoader } from "../components/littleLoader";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AppFallback from "../components/appFallback";
import ZigZagLoader from "../components/zigZagLoader";
import toast from "react-hot-toast";
import { RootState } from "../redux/store";
import { User } from "../redux/slices/userSlice";
import { isAxiosError } from "axios";
import { PostTypes } from "../components/timeline";
import { FollowersModal, FollowingsModal } from "../components/templates";

function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userFollowings, setUserFollowings] = useState<User[] | []>([]);
  const [userFollowers, setUserFollowers] = useState<User[] | []>([]);

  type RouteParams = {
    id: string;
  };

  // Inside your component
  const { id } = useParams<RouteParams>();

  const [idToFollow, setIdToFollow] = useState<string | undefined>(id);

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
    queryKey: ["Follow-user", idToFollow ? idToFollow : ""],
    queryFn: followUserApi,
    enabled: false,
  });

  const {
    data: followingsData,
    refetch: followingsRefetch,
    isSuccess: followingsSuccess,
    isLoading: followingLoading,
  } = useQuery({
    queryKey: ["followings", id ? id : ""],
    queryFn: getUserFollowingsApi,
    enabled: false,
  });

  const {
    data: followersData,
    refetch: followersRefetch,
    isSuccess: followersSuccess,
    isLoading: followersLoading,
  } = useQuery({
    queryKey: ["followers", id ? id : ""],
    queryFn: getUserFollowersApi,
    enabled: false,
  });

  const openFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };
  const openFollowersModal = () => {
    setIsFollowersModalOpen(true);
  };

  const closeFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };
  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  useEffect(() => {
    if (followingsData && followingsSuccess) {
      setUserFollowings(followingsData?.data?.followings);
    }
  }, [followingsData, followingsSuccess]);

  useEffect(() => {
    if (followersData && followersSuccess) {
      setUserFollowers(followersData?.data?.followers);
      // console.log(followersData?.data?.followers);
    }
  }, [followersData, followersSuccess]);

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
              <p
                className=" font-semibold text-center cursor-pointer"
                onClick={() => {
                  followersRefetch();
                  openFollowersModal();
                }}
              >
                {userProfile?.followers?.length}{" "}
                <span className=" font-normal">followers</span>
              </p>
              <p
                className=" font-semibold text-center cursor-pointer"
                onClick={() => {
                  followingsRefetch();
                  openFollowingModal();
                }}
              >
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
      <FollowingsModal
        isOpen={isFollowingModalOpen}
        onClose={closeFollowingModal}
      >
        <div>
          <div className=" flex p-4 pt-1 pb-1">
            <p className=" text-center flex-grow">Following</p>
            <button onClick={closeFollowingModal} className=" cursor-pointer">
              X
            </button>
          </div>
          <hr className=" text-gray-primary" />
          <div className=" p-4 pt-4 overflow-y-auto max-h-80">
            <ul>
              {followingLoading ? (
                <p className=" flex justify-center w-full ">
                  <LittleLoader />
                </p>
              ) : userFollowings.length > 0 ? (
                userFollowings.map((profile: User) => (
                  <li className=" flex gap-2 text-xs font-semibold mb-6">
                    <div>
                      <Link
                        to={`/p/${profile?.name}/${profile?._id}`}
                        onClick={closeFollowingModal}
                      >
                        <img
                          src="/images/avatars/dali.jpg"
                          alt="dali"
                          className=" h-8 w-10 rounded-full"
                        />
                      </Link>
                    </div>

                    <div className=" flex  w-full items-center">
                      <Link
                        to={`/p/${profile?.name}/${profile?._id}`}
                        onClick={closeFollowingModal}
                        className=" flex-grow"
                      >
                        <p className=" whitespace-nowrap overflow-hidden text-ellipsis">
                          {profile.name}
                        </p>
                      </Link>
                      {isSelfProfile(user, profile?._id) === false ? (
                        <button
                          className=" bg-[#efefef] py-1 px-3 rounded-md"
                          onClick={() => {
                            setIdToFollow(profile?._id);
                            setTimeout(() => followUserRefetch(), 500);
                          }}
                        >
                          {followUserLoading ? (
                            <LittleLoader />
                          ) : isFollowing(profile?._id) ? (
                            "Following"
                          ) : (
                            "Follow"
                          )}
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))
              ) : (
                <p>No Following</p>
              )}
            </ul>
          </div>
        </div>
      </FollowingsModal>
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={openFollowersModal}
      >
        <div>
          <div className=" flex p-4 pt-1 pb-1">
            <p className=" text-center flex-grow">Followers</p>
            <button onClick={closeFollowersModal} className=" cursor-pointer">
              X
            </button>
          </div>
          <hr className=" text-gray-primary" />
          <div className=" p-4 pt-4 overflow-y-auto max-h-80">
            <ul>
              {followersLoading ? (
                <p className=" flex justify-center w-full ">
                  <LittleLoader />
                </p>
              ) : userFollowers.length > 0 ? (
                userFollowers.map((profile: User) => (
                  <li className=" flex gap-2 text-xs font-semibold mb-6">
                    <div>
                      <Link
                        to={`/p/${profile?.name}/${profile?._id}`}
                        onClick={closeFollowersModal}
                      >
                        <img
                          src="/images/avatars/dali.jpg"
                          alt="dali"
                          className=" h-8 w-10 rounded-full"
                        />
                      </Link>
                    </div>
                    <div className=" flex  w-full items-center">
                      <Link
                        to={`/p/${profile?.name}/${profile?._id}`}
                        onClick={closeFollowersModal}
                        className=" flex-grow"
                      >
                        <p className=" flex whitespace-nowrap overflow-hidden text-ellipsis">
                          {profile.name}
                        </p>
                      </Link>
                      {isSelfProfile(user, id ? id : "") ? (
                        <button className=" bg-[#efefef] py-1 px-3 rounded-md cursor-not-allowed">
                          Remove
                        </button>
                      ) : isSelfProfile(user, profile?._id) === false ? (
                        <button
                          className=" bg-[#efefef] py-1 px-3 rounded-md"
                          onClick={() => {
                            setIdToFollow(profile?._id);
                            setTimeout(() => followUserRefetch(), 500);
                          }}
                        >
                          {followUserLoading ? (
                            <LittleLoader />
                          ) : isFollowing(profile?._id) ? (
                            "Following"
                          ) : (
                            "Follow"
                          )}
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))
              ) : (
                <p>No Followers</p>
              )}
            </ul>
          </div>
        </div>
      </FollowersModal>
    </div>
  );
}

export default ProfilePage;
