import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Message } from "./directMessageBox";
import ShowMessage from "./showMessage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserNameByIdApi } from "../../apis";
import { format } from "date-fns";

interface TodayChatBoxProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const TodayChatBox: FC<TodayChatBoxProps> = ({ messages, setMessages }) => {
  const { id } = useParams();
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", id ? id : ""],
    queryFn: getUserNameByIdApi,
  });
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");

  useEffect(() => {
    if (data && isSuccess) {
      setUsername(data.data.username);
      if (data.data.avatar.url) setAvatar(data.data.avatar.url);
      else setAvatar("/images/avatars/default.png");
    }
  }, [data, isSuccess]);

  return (
    <div>
      <div className=" text-center text-gray-base text-xs">
        {messages[0]?.createdAt && (
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
      </div>
      <div></div>
    </div>
  );
};

export default TodayChatBox;
