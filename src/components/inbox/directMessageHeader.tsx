import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserNameByIdApi } from "../../apis";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { OnlineUser } from "../../redux/slices/onlineUserSlice";
import { formatDistance } from "date-fns";

function DirectMessageHeader() {
  const { id } = useParams();
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", id ? id : ""],
    queryFn: getUserNameByIdApi,
  });
  const { onlineUsers } = useSelector((state: RootState) => state.onlineUsers);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");

  useEffect(() => {
    function handleOnlineUser(onlineUsers: OnlineUser[]) {
      let userEntry = onlineUsers.find((entry) => entry.userId === id);
      if (userEntry && userEntry.timing.to) {
        let userTiming = formatDistance(userEntry.timing.to, new Date());
        return `Active ${userTiming} ago`;
      } else if (userEntry && userEntry.timing.from && !userEntry.timing.to) {
        return "Online";
      } else {
        return "";
      }
    }
    setUserStatus(() => handleOnlineUser(onlineUsers));
  }, [onlineUsers]);

  useEffect(() => {
    if (data && isSuccess) {
      setUsername(data.data.username);
      if (data.data.avatar.url) setAvatar(data.data.avatar.url);
      else setAvatar("/images/avatars/default.png");
    }
  }, [data, isSuccess, id]);

  return (
    <div className=" bg-white w-full h-12 flex flex-row items-center px-2 justify-between border border-gray-primary">
      <div className=" flex items-center">
        <Link to={`/p/${username}/${id}`}>
          <img src={avatar} alt={username} className=" h-9 w-9 rounded-full" />
        </Link>
        <Link to={`/p/${username}/${id}`}>
          <p className=" font-semibold ml-2 text-sm">{username}</p>
          <p className=" text-xs text-gray-base ml-2">{userStatus}</p>
        </Link>
      </div>
      <div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DirectMessageHeader;
