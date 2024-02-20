import { FC, useEffect, useState } from "react";
import { Messages } from "../../redux/slices/exampleSlice";
import { useQuery } from "@tanstack/react-query";
import { getUserNameByIdApi } from "../../apis";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { formatDistanceToNowStrict } from "date-fns";
import { OnlineUser } from "../../redux/slices/onlineUserSlice";

interface InboxMessangerProfileProps {
  message: Messages;
}

const InboxMessangerProfile: FC<InboxMessangerProfileProps> = ({ message }) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", message.sender],
    queryFn: getUserNameByIdApi,
  });
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");
  const [userOnlineStatus, setUserOnlineStatus] = useState(false);
  const { onlineUsers } = useSelector((state: RootState) => state.onlineUsers);

  const { messagesCount } = useSelector((state: RootState) => state.message);

  const existingSenderIndex = messagesCount.findIndex(
    (count) =>
      count.sender === message.contents[message.contents.length - 1].sender
  );

  useEffect(() => {
    function handleOnlineUser(onlineUsers: OnlineUser[]) {
      let userEntry = onlineUsers.find((entry) =>
        entry.userId === message.sender ? message.sender : ""
      );
      if (userEntry && userEntry.timing.to) {
        // let userTiming = formatDistance(userEntry.timing.to, new Date());
        return false;
      } else if (
        userEntry &&
        userEntry.timing.from &&
        userEntry.timing.to === ""
      ) {
        return true;
      } else {
        return false;
      }
    }
    setUserOnlineStatus(() => handleOnlineUser(onlineUsers));
  }, [onlineUsers]);

  useEffect(() => {
    if (data && isSuccess) {
      setUsername(data.data.username);
      if (data.data.avatar.url) setAvatar(data.data.avatar.url);
      else setAvatar("/images/avatars/default.png");
    }
  }, [data, isSuccess]);
  return (
    <div className=" flex flex-row gap-2 items-center cursor-pointer   pl-2 py-2 bg-white hover:bg-[#efefef] justify-start">
      <div className=" relative rounded-full ">
        <img src={avatar} alt={username} className=" rounded-full h-10 w-10 " />
        {userOnlineStatus && (
          <div className=" bg-[#12AD2B] h-3 w-3 rounded-full absolute -right-1 bottom-1 border border-white " />
        )}
      </div>

      <div>
        <p className=" flex flex-col font-semibold">
          <p className=" text-xs">{username}</p>
          <p
            className={` text-[10px]  ${
              existingSenderIndex !== -1
                ? "font-bold text-[#000000]"
                : "text-gray-base"
            }`}
          >
            {message.contents[message.contents.length - 1].content.length > 20
              ? `${message.contents[
                  message.contents.length - 1
                ].content.substring(0, 20)}...`
              : message.contents[message.contents.length - 1].content}{" "}
            <span>
              <span> • </span>
              {formatDistanceToNowStrict(
                message.contents[message.contents.length - 1].createdAt
                  ? message.contents[message.contents.length - 1].createdAt
                  : new Date()
              )}
            </span>
          </p>
        </p>
      </div>
    </div>
  );
};

export default InboxMessangerProfile;

export const InboxMessangerSuggestedProfile: FC<{ userId: string }> = ({
  userId,
}) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", userId],
    queryFn: getUserNameByIdApi,
  });
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");
  const [userOnlineStatus, setUserOnlineStatus] = useState(false);
  const { onlineUsers } = useSelector((state: RootState) => state.onlineUsers);

  useEffect(() => {
    if (data && isSuccess) {
      setUsername(data.data.username);
      if (data.data.avatar.url) setAvatar(data.data.avatar.url);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    function handleOnlineUser(onlineUsers: OnlineUser[]) {
      let userEntry = onlineUsers.find((entry) =>
        entry.userId === userId ? userId : ""
      );
      if (userEntry && userEntry.timing.to) {
        // let userTiming = formatDistance(userEntry.timing.to, new Date());
        return false;
      } else if (userEntry && userEntry.timing.from && !userEntry.timing.to) {
        return true;
      } else {
        return false;
      }
    }
    setUserOnlineStatus(() => handleOnlineUser(onlineUsers));
  }, [onlineUsers]);

  return (
    <div className=" flex flex-row gap-2 items-center cursor-pointer   pl-2 py-2 bg-white hover:bg-[#efefef] justify-start">
      <div className=" relative rounded-full ">
        <img src={avatar} alt={username} className=" rounded-full h-10 w-10 " />
        {userOnlineStatus && (
          <div className=" bg-[#12AD2B] h-3 w-3 rounded-full absolute -right-1 bottom-1 border border-white " />
        )}
      </div>
      <div>
        <p className=" flex flex-col font-semibold">
          <p className=" text-xs">{username}</p>
        </p>
      </div>
    </div>
  );
};
