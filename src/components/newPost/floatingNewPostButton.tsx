import { FC } from "react";

interface FloatingNewPostButtonProps {
  modalOpenHandler: () => void;
}

const FloatingNewPostButton: FC<FloatingNewPostButtonProps> = ({
  modalOpenHandler,
}) => {
  return (
    <button
      type="button"
      className=" rounded-full  border-white h-12 sm:h-12 w-12 sm:w-12 fixed bottom-4 xl:bottom-8 left-4 md:left-5 xl:left-12 bg-white shadow-md"
      onClick={modalOpenHandler}
    >
      <img
        src="/images/addNewPost.png"
        alt="Post"
        title="Create new Post"
        className=" h-full w-full rounded-full"
      />
    </button>
  );
};

export default FloatingNewPostButton;
