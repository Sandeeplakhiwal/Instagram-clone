import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import TodayChatBox from "./todayChatBox";
import { Message } from "./directMessageBox";

interface DirectMessageBodyProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  messageSeenStatus: string;
  setMessageSeenStatus: Dispatch<SetStateAction<string>>;
}

const DirectMessageBody: FC<DirectMessageBodyProps> = ({
  messages,
  setMessages,
  messageSeenStatus,
  setMessageSeenStatus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      className="h-[80%] px-2 py-2 overflow-y-auto relative"
      ref={containerRef}
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <TodayChatBox
        messages={messages}
        setMessages={setMessages}
        messageSeenStatus={messageSeenStatus}
        setMessageSeenStatus={setMessageSeenStatus}
      />
    </div>
  );
};

export default DirectMessageBody;
