import { Dispatch, FC, SetStateAction, useState } from "react";
import { Message } from "./directMessageBox";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { deleteReceivedMessage } from "../../redux/slices/exampleSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export const copyMessageToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Failed to copy message to clipboard:", error);
      toast.error("Failed to copy message to clipboard");
    });
};

interface ReceivedMessageProps {
  message: Message;
  avatar: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const ReceivedMessage: FC<ReceivedMessageProps> = ({ message, avatar }) => {
  const [moVisible, setMoVisible] = useState<string>("invisible");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { id } = useParams();

  const handleDeleteMessage = (
    userId: string,
    sender: string,
    messageId: string
  ): void => {
    dispatch(deleteReceivedMessage({ userId, sender, messageId }));
    setIsOpen(false);
    toast.success("Message has deleted");
  };

  return (
    <div
      className=" flex flex-row justify-start my-2 py-2 items-center max-w-[80%]"
      onMouseOver={() => setMoVisible("visible")}
      onMouseLeave={() => {
        setMoVisible("invisible");
        setIsOpen(false);
      }}
    >
      <SenderProfilePhoto avatar={avatar} />
      <div className=" bg-[#efefef] px-2 py-1 rounded-2xl ml-2">
        <p className="  text-sm ">{message.content}</p>
      </div>
      <div className={` ${moVisible} cursor-pointer items-center`}>
        <MorePopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleMenu={toggleMenu}
          deleteHandler={handleDeleteMessage}
          sender={id ? id : ""}
          messageId={message._id}
          messageContent={message.content}
          createdAt={message.createdAt}
        />
      </div>
    </div>
  );
};

export default ReceivedMessage;

type SenderProfilePhotoProps = {
  avatar: string;
};
const SenderProfilePhoto: FC<SenderProfilePhotoProps> = ({ avatar }) => (
  <img src={avatar} alt="dali" className=" h-7 w-7 rounded-full" />
);

interface MorePopupProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleMenu: () => void;
  deleteHandler: (userId: string, sender: string, messageId: string) => void;
  sender: string;
  messageId: string;
  messageContent: string;
  createdAt: Date | string;
}

const MorePopup: FC<MorePopupProps> = ({
  isOpen,
  toggleMenu,
  createdAt,
  deleteHandler,
  sender,
  messageId,
  messageContent,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className="relative inline-block text-left items-center  h-full">
      <div className=" items-center  h-full pt-1" title="More">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.0"
          stroke="currentColor"
          className="w-4 h-5 font-extrabold"
          onClick={toggleMenu}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="tree"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          className="origin-top-left absolute left-0 w-24  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <p className=" text-xs font-semibold text-gray-base text-center mb-1 hover:cursor-default">
              {format(createdAt, "E dd HH:mm")}
            </p>
            <hr className=" text-gray-primary" />
            <p
              className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#efefef] hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-0"
            >
              Forward
            </p>
            <p
              className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#efefef] hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-1"
              onClick={() => copyMessageToClipboard(messageContent)}
            >
              Copy
            </p>
            <p
              className="block px-4 py-2 text-xs font-semibold text-red-primary hover:bg-[#efefef] hover:text-red-base"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-2"
              onClick={() =>
                deleteHandler(user ? user._id : "", sender, messageId)
              }
            >
              Delete
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
