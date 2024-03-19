import { Suspense, useEffect, useState } from "react";
import Header from "../components/header";
import Post from "../components/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUserApi,
  getUserFollowersApi,
  getUserFollowingsApi,
  getUserPostsApi,
  getUserProfileApi,
  logoutApi,
} from "../apis";
import LittleLoader, { WhiteLittleLoader } from "../components/littleLoader";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppFallback from "../components/appFallback";
import ZigZagLoader from "../components/zigZagLoader";
import toast from "react-hot-toast";
import { RootState } from "../redux/store";
import { User, removeUser } from "../redux/slices/userSlice";
import { isAxiosError } from "axios";
import { PostTypes } from "../components/timeline";
import {
  FollowersModal,
  FollowingsModal,
  UserSettingsModal,
} from "../components/templates";
import * as PageRoutes from "../constants/routes";

export function isSelfProfile(user: User | null | undefined, id: string) {
  return user?._id.toString() === id.toString();
}

function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userFollowings, setUserFollowings] = useState<User[] | []>([]);
  const [userFollowers, setUserFollowers] = useState<User[] | []>([]);

  type RouteParams = {
    id: string;
  };

  // Inside your component
  const { id } = useParams<RouteParams>();

  const [idToFollow, setIdToFollow] = useState<string | undefined>(id);

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

  const dispatch = useDispatch();

  useEffect(() => {
    document.title = userProfile ? userProfile.name : "";
  }, [userProfile, userProfileData]);

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

  const { refetch: logoutRefetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutApi,
    enabled: false,
  });

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRefetch();
      dispatch(removeUser());
      queryClient.resetQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully");
      navigate(PageRoutes.LOGIN);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const openFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };
  const openFollowersModal = () => {
    setIsFollowersModalOpen(true);
  };
  const openUserSettingsModal = () => {
    setIsUserSettingsModalOpen(true);
  };

  const closeFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };
  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };
  const closeUserSettingsModal = () => {
    setIsUserSettingsModalOpen(false);
  };

  useEffect(() => {
    if (followingsData && followingsSuccess) {
      setUserFollowings(followingsData?.data?.followings);
    }
  }, [followingsData, followingsSuccess]);

  useEffect(() => {
    if (followersData && followersSuccess) {
      setUserFollowers(followersData?.data?.followers);
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

  return userProfileLoading === true ? (
    <AppFallback />
  ) : (
    <div className=" min-w-[375px]">
      <Header />
      <div className="max-w-screen-md bg-white mx-auto p-4 min-h-screen">
        <div id="profile-header" className=" flex mx-auto gap-4 mb-16">
          <div className="  w-1/3 flex justify-center">
            <img
              src={
                userProfile?.avatar
                  ? userProfile.avatar.url
                  : "/images/avatars/default.png"
              }
              alt={user?.name}
              className=" h-24 w-24 sm:h-32 sm:w-32 rounded-full"
            />
          </div>
          <div className=" w-2/3 flex flex-col px-0  sm:px-4 gap-4">
            <p className=" flex flex-col sm:flex-row  w-full gap-2 sm:gap-8 ">
              <p className=" items-end grow sm:grow-0">
                {userProfile && userProfile.name}
              </p>
              {isSelfProfile(user, id ? id : "") ? (
                <div className=" flex flex-row gap-2">
                  <Link
                    to={`/p/edit/${userProfile && userProfile.name}/${
                      userProfile && userProfile._id
                    }`}
                    className=" bg-[#efefef] rounded px-2 py-1 text-xs"
                  >
                    Edit profile
                  </Link>
                  <button onClick={openUserSettingsModal}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                </div>
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
              <div className=" block">
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
                <Link to={`/direct/t/${id}`}>
                  <button className=" mt-2 sm:mt-0 sm:ml-1 bg-[#efefef] px-4 py-1  text-xs font-bold rounded w-full sm:w-28">
                    Message
                  </button>
                </Link>
              </div>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
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
                          src={
                            profile?.avatar
                              ? profile.avatar.url
                              : "/images/avatars/default.png"
                          }
                          alt={profile?.name}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
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
                          src={
                            profile?.avatar
                              ? profile.avatar.url
                              : "/images/avatars/default.png"
                          }
                          alt={profile?.name}
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
      <UserSettingsModal
        isOpen={isUserSettingsModalOpen}
        onClose={closeUserSettingsModal}
      >
        <div>
          <div className=" flex p-4 pt-1 pb-1 items-center">
            <p className=" text-center flex-grow font-bold text-xs">Settings</p>
          </div>
          <hr className=" text-gray-primary" />
          <div className=" flex justify-center w-full">
            <Suspense fallback={<LittleLoader />}>
              <ul className=" w-full pt-1 pb-1">
                <li
                  className="  text-center py-2 font-bold text-xs text-red-primary border-b border-gray-primary items-center cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
                <li
                  className=" py-2 text-center font-bold text-xs items-center cursor-pointer"
                  onClick={closeUserSettingsModal}
                >
                  Cancel
                </li>
              </ul>
            </Suspense>
          </div>
        </div>
      </UserSettingsModal>
    </div>
  );
}

export default ProfilePage;
