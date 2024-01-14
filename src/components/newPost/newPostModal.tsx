import { FC } from "react";
import ImageDragAndDrop from "./imgDropComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalClass = isOpen ? "block" : "hidden";

  return (
    <div
      className={`modal ${modalClass} fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center`}
    >
      <div
        className="p-4 rounded-lg shadow-md w-screen h-screen sm:h-auto sm:w-3/5 flex flex-col pb-8"
        style={{ backgroundColor: "#fafafa" }}
      >
        <div className=" items-center align-bottom mb-4 pt-2 sm:pt-0">
          <button
            className="modal-close font-bold w-7 h-7  rounded-full float-left cursor-pointer"
            onClick={onClose}
            title="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <p className=" text-center font-bold">Create New Post</p>
        </div>

        <ImageDragAndDrop closeModal={onClose} />
      </div>
    </div>
  );
};

export default Modal;
