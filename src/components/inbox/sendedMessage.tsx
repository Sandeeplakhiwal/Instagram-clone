import { Dispatch, FC, SetStateAction, useState } from "react";
import { Message } from "./directMessageBox";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { unsendMessage } from "../../redux/slices/exampleSlice";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";
import { copyMessageToClipboard } from "./receivedMessage";

interface SendedMessageProps {
  message: Message;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const SendedMessage: FC<SendedMessageProps> = ({ message }) => {
  const [moVisible, setMoVisible] = useState<string>("invisible");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleUnsendMessage = (
    userId: string = "",
    messageId: string = ""
  ): void => {
    dispatch(unsendMessage({ userId, messageId }));
    setIsOpen(false);
    toast.success("Message has deleted");
  };

  return (
    <div
      className=" flex flex-row justify-end my-2 py-2 items-center"
      onMouseOver={() => setMoVisible("visible")}
      onMouseLeave={() => {
        setMoVisible("invisible");
        setIsOpen(false);
      }}
    >
      <div className={` ${moVisible} cursor-pointer items-center `}>
        <MorePopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleMenu={toggleMenu}
          unsendHandler={handleUnsendMessage}
          messageId={message._id}
          messageContent={message.content}
          createdAt={message.createdAt}
        />
      </div>
      <div className={` bg-[#0080ff] px-2 py-1 rounded-2xl cursor-default`}>
        <p className=" text-white text-sm font-semibold ">{message.content}</p>
      </div>
    </div>
  );
};

export default SendedMessage;

interface MorePopupProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleMenu: () => void;
  unsendHandler: (userId: string, messageId: string) => void;
  messageId: string;
  messageContent: string;
  createdAt: Date | string;
}

const MorePopup: FC<MorePopupProps> = ({
  isOpen,
  toggleMenu,
  createdAt,
  unsendHandler,
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
          className="origin-top-left absolute left-0 -ml-20 w-24  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
              onClick={() => unsendHandler(user ? user._id : "", messageId)}
            >
              Unsend
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
