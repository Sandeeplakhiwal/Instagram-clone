import { Dispatch, FC, SetStateAction, useEffect } from "react";
import DirectMessageBody from "./directMessageBody";
import DirectMessageFooter from "./directMessageFooter";
import DirectMessageHeader from "./directMessageHeader";
import { useDispatch } from "react-redux";
import { decreaseMessagesCount } from "../../redux/slices/messagesSlice";
import { useParams } from "react-router-dom";

export interface Message {
  sender: string;
  recipient: string;
  content: string;
  createdAt: string | Date;
  _id: string;
}

interface DirectMessageBoxProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const DirectMessageBox: FC<DirectMessageBoxProps> = ({
  messages,
  setMessages,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(decreaseMessagesCount(id ? id : ""));
  }, [dispatch]);
  return (
    <div className="w-full h-full border border-gray-primary ">
      <DirectMessageHeader />
      <DirectMessageBody messages={messages} setMessages={setMessages} />

      <DirectMessageFooter setMessages={setMessages} />
    </div>
  );
};

export default DirectMessageBox;
