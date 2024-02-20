import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import DirectMessageBody from "./directMessageBody";
import DirectMessageFooter from "./directMessageFooter";
import DirectMessageHeader from "./directMessageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageSeenConversation,
  decreaseMessagesCount,
} from "../../redux/slices/messagesSlice";
import { useParams } from "react-router-dom";
import { RootState } from "../../redux/store";

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
  const { messageSeenConversations } = useSelector(
    (state: RootState) => state.message
  );
  const { user } = useSelector((state: RootState) => state.user);
  const getConversationSeenStatus = (
    arr: MessageSeenConversation[]
  ): string => {
    let status = arr.find(
      (convers) => convers.sender === user?._id && convers.recipient === id
    )?.status;
    return status ? status : "";
  };
  const [messageSeenStatus, setMessageSeenStatus] = useState<string>(() =>
    getConversationSeenStatus(messageSeenConversations)
  );

  useEffect(() => {
    dispatch(decreaseMessagesCount(id ? id : ""));
  }, [dispatch]);

  return (
    <div className="w-full h-full border border-gray-primary ">
      <DirectMessageHeader />
      <DirectMessageBody
        messages={messages}
        setMessages={setMessages}
        messageSeenStatus={messageSeenStatus}
        setMessageSeenStatus={setMessageSeenStatus}
      />

      <DirectMessageFooter
        setMessages={setMessages}
        messageSeenStatus={messageSeenStatus}
        setMessageSeenStatus={setMessageSeenStatus}
      />
    </div>
  );
};

export default DirectMessageBox;
