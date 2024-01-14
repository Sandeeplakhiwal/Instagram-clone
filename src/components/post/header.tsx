import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FC, FormEvent, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { deletePostApi, followUserApi, updateCaptionApi } from "../../apis";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isAxiosError } from "axios";
import { User } from "../../redux/slices/userSlice";

interface UserInterface {
  username: string;
  userAvatar: string;
  userId: string;
  postId: string;
}

const Header: React.FC<UserInterface> = ({ username, userId, postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [caption, setCaption] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReportButton = () => {
    closeModal();
    setTimeout(() => {
      toast.success("Your report has been submitted");
    }, 1000);
  };

  const queryClient = useQueryClient();

  const {
    data: postDeleteData,
    error: postDeleteError,
    isSuccess: postDeleteSuccess,
    refetch: postDeleteRefetch,
  } = useQuery({
    queryKey: ["delete-post", postId],
    queryFn: deletePostApi,
    enabled: false,
  });

  const {
    data: followUnfollowData,
    refetch: followUnfollowRefetch,
    isSuccess,
  } = useQuery({
    queryKey: ["Follow-user", userId],
    queryFn: followUserApi,
    enabled: false,
  });

  useEffect(() => {
    if (isSuccess && followUnfollowData) {
      // toast.success(followUnfollowData?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["postsOfFollowing"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Suggestions-to-follow"],
      });
      queryClient.resetQueries({ queryKey: ["Follow-user"] });
    }
  }, [isSuccess, followUnfollowData]);

  useEffect(() => {
    if (postDeleteData && postDeleteSuccess) {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["postsOfFollowing", "user"] });
    }
    if (postDeleteError) {
      if (
        isAxiosError(postDeleteError) &&
        postDeleteError?.message === "Network Error"
      ) {
        toast.error("Network Error!");
      }
      if (
        isAxiosError(postDeleteError) &&
        postDeleteError.response &&
        postDeleteError.response.data
      ) {
        const errorMessage = (
          postDeleteError.response.data as { message: string }
        ).message;
        toast.error(errorMessage);
      }
    }
  }, [postDeleteData, postDeleteError, postDeleteSuccess]);

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

  const handleEditPostModalClose = () => {
    setIsEditPostModalOpen(false);
  };

  const {
    data: UpdateCaptionData,
    error: UpadteCaptionError,
    isPending: UpdateCaptionPending,
    mutate: UpdateCaptionMutate,
    isSuccess: UpdateCaptionSuccess,
  } = useMutation({
    mutationKey: ["update-caption"],
    mutationFn: updateCaptionApi,
  });

  const updateCaptionSubmitHandler = (
    e: FormEvent,
    postId: string,
    caption: string
  ) => {
    e.preventDefault();
    UpdateCaptionMutate({ postId, caption });
  };

  useEffect(() => {
    if (UpdateCaptionSuccess && UpdateCaptionData) {
      queryClient.invalidateQueries({ queryKey: ["postsOfFollowing"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      handleEditPostModalClose();
      setCaption("");
    }
    if (UpadteCaptionError) {
      if (
        isAxiosError(UpadteCaptionError) &&
        UpadteCaptionError?.message === "Network Error"
      ) {
        toast.error("Network Error!");
      }
      if (
        isAxiosError(UpadteCaptionError) &&
        UpadteCaptionError.response &&
        UpadteCaptionError.response.data
      ) {
        const errorMessage = (
          UpadteCaptionError.response.data as { message: string }
        ).message;
        toast.error(errorMessage);
      }
    }
  }, [
    UpdateCaptionData,
    UpadteCaptionError,
    UpdateCaptionPending,
    UpdateCaptionSuccess,
  ]);

  return (
    <div>
      <div className=" flex border-b border-gray-primary h-4 p-4 pl-1 sm:pl-4 py-8 items-center">
        <div className="flex flex-grow">
          <Link to={`/p/${username}/${userId}`} className=" flex items-center ">
            <img
              src="/images/avatars/karl.jpg"
              alt="karl"
              className=" rounded-full h-10 w-10 flex mr-3"
            />
            <p className=" font-bold">{username}</p>
          </Link>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ul className="list-none w-full text-center text-xs rounded-lg">
          {user?._id.toString() === userId.toString() ? (
            <>
              <li
                className=" font-semibold text-red-primary border-b border-gray-primary py-3 cursor-pointer"
                onClick={() => {
                  postDeleteRefetch();
                  closeModal();
                }}
              >
                Delete
              </li>
              <li
                className=" font-semibold  border-b border-gray-primary py-3 cursor-pointer"
                onClick={() => {
                  closeModal();
                  setIsEditPostModalOpen(true);
                }}
              >
                Edit
              </li>
            </>
          ) : null}
          {user && user._id.toString() !== userId.toString() ? (
            <>
              <li
                className=" text-red-primary font-semibold border-b border-gray-primary py-3 cursor-pointer"
                onClick={handleReportButton}
              >
                <span className="text-red-500">Report</span>
              </li>
              <li
                className=" font-semibold text-red-primary border-b border-gray-primary items-center py-3 cursor-pointer"
                onClick={() => {
                  followUnfollowRefetch();
                  closeModal();
                }}
              >
                <span className={isFollowing(userId) ? "" : "text-red-primary"}>
                  {isFollowing(userId) ? "Unfollow" : "Follow"}
                </span>
              </li>
            </>
          ) : null}
          <li className=" font-semibold border-b border-gray-primary py-3 cursor-pointer">
            <Link to={`/p/${username}`}>Visit this account</Link>
          </li>
          <li
            className=" font-semibold border-b border-gray-primary py-3 cursor-pointer"
            onClick={() => {
              setIsModalOpen(false);
              setCaption("");
            }}
          >
            Cancel
          </li>
        </ul>
      </Modal>
      <PostEditModal
        isOpen={isEditPostModalOpen}
        onClose={handleEditPostModalClose}
      >
        <div className=" p-4 pt-2 ">
          <form>
            <div className=" flex flex-row w-full justify-between items-center">
              <button
                type="button"
                className=" text-blue-medium text-xs"
                onClick={handleEditPostModalClose}
              >
                Cancel
              </button>
              <p className="  text-gray-base text-xs">Edit Caption</p>
              <button
                type="button"
                className=" text-blue-medium text-xs"
                onClick={(e: FormEvent) =>
                  updateCaptionSubmitHandler(e, postId, caption)
                }
              >
                Done
              </button>
            </div>
            <textarea
              placeholder="Write a caption.."
              className=" w-full mt-4 outline-none text-gray-base italic text-xs"
              rows={8}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              id="Caption-textArea"
              name="caption"
            />
          </form>
        </div>
      </PostEditModal>
    </div>
  );
};

export default Header;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const bodyElement = document.body;

    if (isOpen) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "";
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      bodyElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-black-light "
    >
      <div className="bg-white rounded-lg shadow-md w-6/12 sm:w-3/12">
        {children}
      </div>
    </div>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PostEditModal: FC<EditModalProps> = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    const bodyElement = document.body;

    if (isOpen) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "";
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      bodyElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-black-light "
    >
      <div className="bg-white rounded-lg shadow-md w-9/12 sm:w-3/12">
        {children}
      </div>
    </div>
  );
};
