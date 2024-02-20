import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Message } from "./directMessageBox";
import ShowMessage from "./showMessage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserNameByIdApi } from "../../apis";
import { format } from "date-fns";
import { socket } from "../header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addToMessageSeenConversation } from "../../redux/slices/messagesSlice";

interface TodayChatBoxProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  messageSeenStatus: string;
  setMessageSeenStatus: Dispatch<SetStateAction<string>>;
}

const TodayChatBox: FC<TodayChatBoxProps> = ({
  messages = [],
  setMessages,
  messageSeenStatus,
  setMessageSeenStatus,
}) => {
  const { id } = useParams();
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", id ? id : ""],
    queryFn: getUserNameByIdApi,
  });
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data && isSuccess) {
      setUsername(data.data.username);
      if (data.data.avatar.url) setAvatar(data.data.avatar.url);
      else setAvatar("/images/avatars/default.png");
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.recipient === user?._id) {
      // Emit message_seen event
      socket.emit("message_seen", {
        sender: lastMessage.sender,
        recipient: lastMessage.recipient,
      });
    }
  }, [messages, user]);

  useEffect(() => {
    // Listen for message has seen event
    const handleSeenMessage = ({
      sender,
      recipient,
    }: {
      sender: string;
      recipient: string;
    }) => {
      // Handle message has been seen
      dispatch(addToMessageSeenConversation({ sender, recipient }));
      setMessageSeenStatus(`Seen`);
    };

    socket.on("message_has_seen", handleSeenMessage);
  }, []);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === user?._id
    ) {
      // Emit pending_message_seen_for_conversation event
      socket.emit("pending_message_seen_for_conversation", {
        senderId: user?._id,
        recipientId: id,
      });
    }
  }, [id, user, messages]);

  return (
    <div>
      <div className=" text-center text-gray-base text-xs">
        {messages.length > 0 && messages[0]?.createdAt && (
          <p>
            {format(messages[0].createdAt, "dd/MM/yyyy")},{" "}
            {format(messages[0].createdAt, "HH:mm")}
          </p>
        )}
      </div>
      <div>
        {messages.map((message: Message, index) => (
          <ShowMessage
            key={index}
            message={message}
            username={username}
            avatar={avatar}
            setMessages={setMessages}
          />
        ))}
        {messages.length > 0 &&
          messages[messages.length - 1].sender === user?._id && (
            <div className=" flex justify-end -mt-4 mb-4 pr-1">
              <span className=" text-right text-xs text-gray-base">
                {messageSeenStatus === "Seen" ? "Seen" : ""}
              </span>
            </div>
          )}
      </div>
      <div></div>
    </div>
  );
};

export default TodayChatBox;
