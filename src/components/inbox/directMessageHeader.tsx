import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserNameByIdApi } from "../../apis";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { OnlineUser } from "../../redux/slices/onlineUserSlice";
import { formatDistance } from "date-fns";
import toast from "react-hot-toast";

interface DirectMessageHeaderProps {
  toggleSidebar: () => void;
  sidebarVisible: boolean;
}

function DirectMessageHeader({
  toggleSidebar,
  sidebarVisible,
}: DirectMessageHeaderProps) {
  const { id } = useParams();
  const { data, isSuccess } = useQuery({
    queryKey: ["get-username-by-id", id ? id : ""],
    queryFn: getUserNameByIdApi,
  });
  const { onlineUsers } = useSelector((state: RootState) => state.onlineUsers);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/default.png");

  function handleAudioCallBtn() {
    toast.error("We are working on this feature");
  }
  function handleVideoCallBtn() {
    handleAudioCallBtn();
  }

  useEffect(() => {
    function handleOnlineUser(onlineUsers: OnlineUser[]) {
      let userEntry = onlineUsers.find((entry) => entry.userId === id);
      if (userEntry && userEntry.timing.to) {
        let userTiming = formatDistance(userEntry.timing.to, new Date());
        return `Active ${userTiming} ago`;
      } else if (userEntry && userEntry.timing.from && !userEntry.timing.to) {
        return "Active now";
      } else {
        return "";
      }
    }
    setUserStatus(() => handleOnlineUser(onlineUsers));
  }, [onlineUsers, id]);

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
        <Link to={`/p/${username}/${id}`} className=" relative">
          <img src={avatar} alt={username} className=" h-9 w-9 rounded-full" />
          {userStatus === "Active now" && (
            <div className=" bg-[#12AD2B] h-[10px] w-[10px] rounded-full absolute -right-1 bottom-1 border border-white " />
          )}
        </Link>
        <Link to={`/p/${username}/${id}`}>
          <p className=" font-semibold ml-2 text-sm">{username}</p>
          <p className=" text-xs text-gray-base ml-2">{userStatus}</p>
        </Link>
      </div>
      <div className=" flex flex-row gap-2 ">
        <button
          title="Audio call"
          className=" mr-1"
          onClick={handleAudioCallBtn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
        </button>
        <Link
          to={`/call/?has_video=true&ig_id=${id}`}
          target={"_blank"}
          className=" flex items-center"
          onClick={(e) => e.preventDefault()}
        >
          <button
            title="Video call"
            className=" mr-1"
            onClick={handleVideoCallBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </button>
        </Link>
        <button title="Sidebar" onClick={toggleSidebar}>
          {sidebarVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={"currentColor"}
              className={`w-6 h-6`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default DirectMessageHeader;
