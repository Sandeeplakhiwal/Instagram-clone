import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { getPostLikesApi, likeDislikePostApi } from "../../apis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { RootState } from "../../redux/store";

interface ActionProps {
  totalLikes: any[];
  postId: string;
  commentsSlice: number;
  setCommentsSlice: React.Dispatch<React.SetStateAction<number>>;
}

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

const Actions: FC<ActionProps> = ({
  totalLikes = [],
  postId,
  setCommentsSlice,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [toggleLiked, setToggleLiked] = useState(() =>
    hasUserLikedPost(totalLikes)
  );
  const [likes, setLikes] = useState(totalLikes.length);

  const {
    data: updatedLikes,
    // error: updatedLikesError,
    isSuccess: updateLikesSuccess,
    refetch: updateLikesRefetch,
  } = useQuery({
    queryKey: ["updated likes", postId],
    queryFn: getPostLikesApi,
    enabled: false,
  });

  const {
    data: likeData,
    error: likeError,
    refetch: likeRefetch,
    isSuccess: likeSuccess,
  } = useQuery({
    queryKey: ["like-or-dislike-post", postId],
    queryFn: likeDislikePostApi,
    enabled: false,
  });

  const handleToggleLiked = () => {
    setToggleLiked(!toggleLiked);
    likeRefetch();
  };

  function hasUserLikedPost(likes: any[]): boolean {
    let likeIndex = -1;
    likes.forEach((item, index) => {
      if (user && item._id?.toString() === user._id?.toString()) {
        likeIndex = index;
      }
    });
    // return likeIndex == -1 ? false : true;
    return likeIndex !== -1;
  }

  useEffect(() => {
    if (likeSuccess && likeData) {
      updateLikesRefetch();
    }

    if (likeError) {
      if (isAxiosError(likeError) && likeError?.message === "Network Error") {
        toast.error("Network Error!");
      }
      if (
        isAxiosError(likeError) &&
        likeError.response &&
        likeError.response.data
      ) {
        const errorMessage = (likeError.response.data as { message: string })
          .message;
        toast.error(errorMessage);
      }
    }
  }, [likeSuccess, likeData, likeError]);

  useEffect(() => {
    if (updateLikesSuccess && updatedLikes && likeSuccess) {
      setLikes(updatedLikes.data?.likes?.length);
    }
  }, [updateLikesSuccess, updatedLikes, likeSuccess]);

  return (
    <>
      <div className="flex justify-between p-4 pb-0 ">
        <div className="flex ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={toggleLiked ? "red" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked ? "fill-red text-red-base" : "text-black-light"
            }`}
            onClick={handleToggleLiked}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            className="w-8 text-black-light select-none cursor-pointer focus:outline-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            onClick={() =>
              setCommentsSlice((commentsSlice) => commentsSlice + 3)
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold text-xs">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </>
  );
};

export default Actions;
