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
      className=" rounded-full  border-white h-10 sm:h-12 w-10 sm:w-12 fixed bottom-4 left-4 md:left-6"
      onClick={modalOpenHandler}
    >
      <img
        src="/images/story.png"
        alt="Post"
        title="Create new Post"
        className=" h-full w-full rounded-full  "
      />
    </button>
  );
};

export default FloatingNewPostButton;
