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
import MessageDetailsHeader from "../messageDetails/messageDetailsHeader";
import MessageDetailsFooter from "../messageDetails/messageDetailsFooter";

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

  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    dispatch(decreaseMessagesCount(id ? id : ""));
  }, [dispatch]);

  useEffect(() => {
    setMessageSeenStatus(() =>
      getConversationSeenStatus(messageSeenConversations)
    );
  }, [id]);

  return (
    <>
      <div
        className={`w-full h-full border border-gray-primary ${
          sidebarVisible ? " hidden sm:block" : " block"
        }`}
      >
        <DirectMessageHeader
          toggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
        />
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
      <div
        className={` relative w-full sm:w-2/6 transition-transform duration-1000 ease-in-out ${
          sidebarVisible ? " block" : " hidden"
        }`}
      >
        <MessageDetailsHeader toggleSidebar={toggleSidebar} />
        <MessageDetailsFooter />
      </div>
    </>
  );
};

export default DirectMessageBox;
