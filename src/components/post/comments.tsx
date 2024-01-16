import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddComment from "./addComment";
import { formatDistance } from "date-fns";
import { Modal } from "./header";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi, getPostCommentsApi } from "../../apis";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { RootState } from "../../redux/store";
import { User } from "../../redux/slices/userSlice";

interface Comment {
  user: User;
  comment: string;
  _id: string;
}

interface CommentsProp {
  allComments: Comment[];
  userId: string;
  postId: string;
  postDate: Date;
  commentsSlice: number;
  setCommentsSlice: React.Dispatch<React.SetStateAction<number>>;
}

const Comments: FC<CommentsProp> = ({
  allComments = [],
  userId,
  postId,
  postDate,
  commentsSlice,
  setCommentsSlice,
}) => {
  // const [commentsSlice, setCommentsSlice] = useState(3);
  const [comments, setComments] = useState(allComments);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleReportButton = () => {
    handleModalClose();
    setTimeout(() => {
      toast.success("Your report has been submitted");
    }, 1000);
  };

  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const {
    data: deleteCommentData,
    error: deleteCommentError,
    isSuccess: deleteCommentSuccess,
    refetch: deleteCommentRefetch,
  } = useQuery({
    queryKey: ["delete-comment", { postId, commentId }],
    queryFn: deleteCommentApi,
    enabled: false,
  });

  const {
    data: updatedComments,
    refetch: updateCommentsRefetch,
    isSuccess: updateCommentsSuccess,
  } = useQuery({
    queryKey: ["updated comments", postId],
    queryFn: getPostCommentsApi,
    enabled: false,
  });

  useEffect(() => {
    if (deleteCommentSuccess && deleteCommentData) {
      updateCommentsRefetch();
      setCommentId("");
      setOwnerId("");
    }
    if (deleteCommentError) {
      if (
        isAxiosError(deleteCommentError) &&
        deleteCommentError?.message === "Network Error"
      ) {
        toast.error("Network Error!");
      }
      if (
        isAxiosError(deleteCommentError) &&
        deleteCommentError.response &&
        deleteCommentError.response.data
      ) {
        const errorMessage = (
          deleteCommentError.response.data as { message: string }
        ).message;
        toast.error(errorMessage);
      }
      queryClient.resetQueries({ queryKey: ["delete-comment"] });
      setCommentId("");
      setOwnerId("");
    }
  }, [deleteCommentData, deleteCommentError, deleteCommentSuccess]);

  useEffect(() => {
    if (updateCommentsSuccess) {
      setComments(updatedComments?.data?.comments);
      queryClient.resetQueries({ queryKey: ["delete-comment"] });
    }
  }, [updatedComments, updateCommentsSuccess, deleteCommentSuccess]);

  return (
    <>
      <div className=" p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <div key={item._id} className="mb-1 flex items-center ">
            <div className="pr-2">
              <Link to={"/"}>
                <img
                  src={
                    item?.user?.avatar
                      ? item.user.avatar.url
                      : "/images/avatars/default.png"
                  }
                  alt={item?.user?.name}
                  className=" h-6 w-6 rounded-full"
                />
              </Link>
            </div>
            <div className="  align-top items-start pt-0">
              <p className=" align-top items-start">
                <Link to={`/`}>
                  <span className="mr-1 font-bold text-xs">
                    {item.user.name}
                  </span>
                </Link>
                <span className=" text-xs font-medium">{item.comment}</span>
              </p>
              <p className=" text-xs opacity-75 flex gap-4">
                <span>14w</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setModalOpen(true);
                    setCommentId(item._id);
                    console.log("1", item._id);
                    setOwnerId(item.user._id);
                    console.log("2", item.user._id);
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </p>
            </div>
          </div>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            type={"button"}
            onClick={() =>
              setCommentsSlice(commentsSlice + comments.length / 2)
            }
            className=" text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
          >
            View more comments
          </button>
        )}
        <p className=" text-gray-base uppercase text-xs mt-1">
          {formatDistance(postDate, new Date())} ago
        </p>
      </div>
      <AddComment
        postId={postId}
        comments={comments}
        setComments={setComments}
      />
      <Modal isOpen={modalOpen} onClose={handleModalClose}>
        <ul className="list-none w-full text-center text-xs rounded-lg">
          <li
            className=" font-semibold text-red-primary border-b border-gray-primary py-3 cursor-pointer"
            onClick={handleReportButton}
          >
            Report
          </li>
          {user?._id.toString() === ownerId.toString() ||
          user?._id.toString() === userId.toString() ? (
            <li
              className=" font-semibold text-red-primary border-b border-gray-primary py-3 cursor-pointer"
              onClick={() => {
                deleteCommentRefetch();
                handleModalClose();
              }}
            >
              Delete
            </li>
          ) : null}
          <li
            className=" font-semibold border-b border-gray-primary py-3 cursor-pointer"
            onClick={handleModalClose}
          >
            Cancel
          </li>
        </ul>
      </Modal>
    </>
  );
};

export default Comments;
