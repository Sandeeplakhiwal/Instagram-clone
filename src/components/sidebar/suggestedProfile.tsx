import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { followUserApi } from "../../apis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { User } from "../../redux/slices/userSlice";
import { AxiosError } from "axios";
import { RootState } from "../../redux/store";

interface SugProfileType {
  _id: string;
  avatar: string;
  userName: string;
}

export const isFollowing = (user: User | null | undefined, _id: string) => {
  let myIndex = -1;
  user?.following?.forEach((item: User, index: number) => {
    if (item._id.toString() === _id.toString()) {
      myIndex = index;
    }
  });
  return myIndex === -1 ? false : true;
};

const SuggestedProfile: React.FC<SugProfileType> = ({
  _id,
  avatar,
  userName,
}) => {
  const {
    data: followUserData,
    refetch: followUserRefetch,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["Follow-user", _id],
    queryFn: followUserApi,
    enabled: false,
  });

  const { user } = useSelector((state: RootState) => state.user);

  const handleFollowBtn = (_id: string) => {
    console.log("Now Following");
    followUserRefetch();
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess && followUserData) {
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({ queryKey: ["postsOfFollowing"] });
    }
    if (error) {
      if (isAxiosError(error) && error?.message === "Network Error") {
        toast.error("Network error");
      }

      if (isAxiosError(error) && error.response && error.response.data) {
        const errorMessage = (error.response.data as { message: string })
          .message;
        toast.error(errorMessage);
      }
    }
  }, [error, isSuccess, followUserData]);

  function isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }

  return (
    <div className="flex flex-row items-center align-items justify-between">
      <Link to={`/p/${userName}/${_id}`}>
        <div className=" flex items-center justify-center">
          <img
            src={avatar}
            alt="avatar"
            className=" rounded-full w-8 flex mr-3"
          />

          <p className="font-bold text-sm">{userName}</p>
        </div>
      </Link>
      <button
        className={` text-xs font-bold text-blue-medium`}
        onClick={() => handleFollowBtn(_id)}
      >
        {isFollowing(user, _id) ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default SuggestedProfile;
