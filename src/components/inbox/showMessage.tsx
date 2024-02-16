import { Dispatch, FC, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Message } from "./directMessageBox";
import SendedMessage from "./sendedMessage";
import ReceivedMessage from "./receivedMessage";

interface ShowMessageProps {
  message: Message;
  username?: string;
  avatar: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const ShowMessage: FC<ShowMessageProps> = ({
  message,
  avatar,
  setMessages,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  return message.sender === user?._id ? (
    <SendedMessage message={message} setMessages={setMessages} />
  ) : (
    <ReceivedMessage
      message={message}
      avatar={avatar}
      setMessages={setMessages}
    />
  );
};

export default ShowMessage;
