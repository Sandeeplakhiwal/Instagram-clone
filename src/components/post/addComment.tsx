import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, FormEvent, useEffect, useState } from "react";
import { addCommentApi, getPostCommentsApi } from "../../apis";
import toast from "react-hot-toast";
import LittleLoader from "../littleLoader";
import { isAxiosError } from "axios";

interface AddCommentProps {
  comments: any[];
  setComments: Dispatch<any>;
  postId: string;
}

function AddComment({ setComments, postId }: AddCommentProps) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const {
    data: updatedComments,
    refetch,
    isSuccess: updateCommentsSuccess,
    isLoading: updateCommentsLoading,
  } = useQuery({
    queryKey: ["updated comments", postId],
    queryFn: getPostCommentsApi,
    enabled: false,
  });

  console.log(updatedComments);

  const {
    data,
    error,
    isSuccess,
    mutate,
    isPending: commentMutationLoading,
  } = useMutation({
    mutationKey: ["addComment"],
    mutationFn: addCommentApi,
  });
  const commentBtnHandler = async (e: FormEvent, postId: string) => {
    e.preventDefault();
    try {
      await mutate({ id: postId, comment });

      queryClient.refetchQueries({ queryKey: ["postOfFollowing"] });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      refetch();
      queryClient.refetchQueries({ queryKey: ["postOfFollowing"] });
    }
    if (error) {
      if (isAxiosError(error) && error?.message === "Network Error") {
        toast.error("Network Error!");
      }
      if (isAxiosError(error) && error.response && error.response.data) {
        const errorMessage = (error.response.data as { message: string })
          .message;
        toast.error(errorMessage);
      }
    }
  }, [isSuccess, data, refetch, error]);

  useEffect(() => {
    if (updateCommentsSuccess && isSuccess) {
      setComment("");
      setComments(updatedComments.data.comments);
    }
  }, [updatedComments, updateCommentsSuccess, isSuccess]);

  return (
    <div className=" border-t border-gray-primary ">
      <form
        method="POST"
        className=" flex justify-between pl-0 pr-5"
        onSubmit={(e) =>
          comment.length > 1 ? commentBtnHandler(e, postId) : e.preventDefault()
        }
      >
        <input
          type="text"
          aria-label="Add a comment"
          autoComplete="off"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          className=" text-sm text-gray-base w-full mr-3 py-3 px-4 outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type={"button"}
          className={` text-sm font-bold text-blue-medium ${
            !comment && "opacity-25"
          }`}
          disabled={comment.length < 1}
          onClick={(e) => commentBtnHandler(e, postId)}
        >
          {commentMutationLoading || updateCommentsLoading ? (
            <LittleLoader />
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddComment;
