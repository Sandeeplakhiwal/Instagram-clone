import { useState, KeyboardEvent, FC, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Message } from "./directMessageBox";
import { addNewMessage } from "../../redux/slices/exampleSlice";
import { socket } from "../header";
import { useParams } from "react-router-dom";

interface DirectMessageFooterProps {
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const DirectMessageFooter: FC<DirectMessageFooterProps> = ({ setMessages }) => {
  const [inputText, setInputText] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const { id } = useParams();

  const sendMessageHandler = () => {
    if (inputText.trim()) {
      const createdAt = new Date();
      const newMessage = {
        sender: user ? user._id : "",
        recipient: id ? id : "",
        content: inputText,
        createdAt,
      };

      // Update state with the new message
      setMessages((prevMessages) => [...prevMessages, newMessage] as Message[]);

      // Emit the private message through the socket
      socket.emit("private_message", newMessage);

      // Update message in localstorage
      // dispatch(addMessage(newMessage));
      dispatch(
        addNewMessage({
          sender: newMessage.sender,
          recipient: newMessage.recipient,
          userId: user ? user._id : "",
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        })
      );
    }

    // Clear the input text
    setInputText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  return (
    <div className=" sticky bottom-0 w-full px-4 py-2 bg-white  flex flex-row justify-center h-14">
      <input
        type="text"
        placeholder="Message..."
        className=" w-full border border-gray-primary h-10 lg:h-12 rounded-2xl px-4 outline-none text-sm relative items-center "
        autoFocus={true}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        title="Message"
        onClick={sendMessageHandler}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      {inputText ? (
        <button
          className={`text-blue-medium absolute right-8 font-bold top-5`}
          onClick={sendMessageHandler}
        >
          Send
        </button>
      ) : null}
    </div>
  );
};

export default DirectMessageFooter;
