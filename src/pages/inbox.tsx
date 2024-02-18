import { ChangeEvent, FC, useEffect, useState } from "react";
import Header from "../components/header";
import { Message } from "../components/inbox/directMessageBox";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DirectMessageSidebar from "../components/inbox/directMessageSidebar";
import NewMessageBox, {
  NewMessageModal,
} from "../components/inbox/newMessageBox";
import { useQuery } from "@tanstack/react-query";
import { searchUserProfile } from "../apis";
import ZigZagLoader from "../components/zigZagLoader";
import { Link } from "react-router-dom";
import { User } from "../redux/slices/userSlice";
import { OnlineUser } from "../redux/slices/onlineUserSlice";

function Inbox() {
  useEffect(() => {
    document.title = "Inbox • Chats";
  }, []);

  const { user } = useSelector((state: RootState) => state.user);

  const messagesInRedux = useSelector(
    (state: RootState) => state.message.messages
  );
  const [messages, setMessages] = useState<Message[]>(messagesInRedux);

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [profiles, setProfiles] = useState<User[] | []>([]);
  const [messageTo, setMessageTo] = useState({
    username: "",
    userId: "",
  });

  const {
    data: searchData,
    error: searchError,
    refetch: searchRefetch,
    isSuccess: searchSuccess,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["search", searchText],
    queryFn: searchUserProfile,
    enabled: false,
  });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setTimeout(() => {
      searchRefetch();
    }, 500);
  };

  const handleSearch = () => {
    searchRefetch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchSuccess && searchData) {
      setProfiles(searchData?.data?.users);
    }
  }, [searchSuccess, searchData, searchError]);

  return (
    <>
      <Header messages={messages} setMessages={setMessages} />
      <div className=" flex flex-row sm:px-2 max-w-screen-2xl mx-auto overflow-hidden overflow-y-hidden lg:h-[87vh] md:h-[88vh] sm:h-screen h-[85vh] -mt-2">
        <div className=" h-screen sm:w-3/12 w-full bg-white pt-2 border border-gray-primary ">
          <div className=" px-2 flex flex-row items-center justify-between  mb-2">
            <p className="font-bold text-[14px] underline ">
              {user && user.name}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-default"
              onClick={handleOpenModal}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
          <div className=" py-2 pl-2">
            <p className=" font-bold text-[13px] ">Messages</p>
          </div>
          <div
            className=" h-full overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <DirectMessageSidebar />
          </div>
        </div>
        <div className=" sm:flex flex-grow h-full hidden">
          <NewMessageBox />
        </div>
      </div>
      <NewMessageModal isOpen={isOpen} onClose={handleCloseModal}>
        <div className=" flex px-2 flex-row flex-wrap border-b border-gray-primary">
          <p className=" font-semibold text-lg mr-1 p-2">To:</p>
          {messageTo.username ? (
            <div className=" px-1 py-1 h-7 my-auto flex flex-row gap-1 rounded-xl text-[#0095f6] bg-[#efefef] font-semibold items-center">
              <p className=" text-sm cursor-default hover:text-[#000000]">
                {messageTo.username}
              </p>
              <button
                onClick={() => setMessageTo({ userId: "", username: "" })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.0"
                  stroke="currentColor"
                  className="w-4 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : null}
          <input
            type={"search"}
            className=" flex flex-1 px-2 outline-none"
            placeholder="Search.."
            onKeyPress={handleKeyPress}
            autoFocus={true}
            value={searchText}
            onChange={(e) => handleInputChange(e)}
          />
          {searchLoading ? <ZigZagLoader /> : null}
          <button onClick={handleSearch} type="button"></button>
        </div>
        <div className=" py-4 w-full ">
          <div className=" h-[30vh] overflow-y-scroll w-full ">
            <ul className="flex flex-col bg-white m-1 rounded-md w-11/12 mx-auto">
              {searchText && profiles.length === 0 ? (
                <p className=" px-5">No account found</p>
              ) : (
                profiles.map((profile) => (
                  <li
                    key={profile?._id}
                    className=" w-full cursor-pointer flex justify-between rounded p-2 items-center  mb-1 hover:bg-[#efefef]"
                    onClick={() => {
                      setMessageTo({
                        userId: profile._id,
                        username: profile.name,
                      });
                      setSearchText("");
                      setProfiles([]);
                    }}
                  >
                    <ProfileShowcaseComponent profile={profile} />
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className=" px-5 mx-auto">
            <Link
              to={`/direct/t/${messageTo.userId}`}
              onClick={(e) => (!messageTo.userId ? e.preventDefault() : null)}
            >
              <button
                className=" w-full bg-[#0095f6] hover:bg-[#0787db] text-white font-bold px-4 py-2 text-center text-sm rounded-md mt-2 tracking-wide disabled:bg-[#b2dcf7] "
                disabled={messageTo.userId ? false : true}
              >
                Chat
              </button>
            </Link>
          </div>
        </div>
      </NewMessageModal>
    </>
  );
}

export default Inbox;

interface ProfileShowcaseComponentProp {
  profile: User;
}

export const ProfileShowcaseComponent: FC<ProfileShowcaseComponentProp> = ({
  profile,
}) => {
  const [userOnlineStatus, setUserOnlineStatus] = useState(false);
  const { onlineUsers } = useSelector((state: RootState) => state.onlineUsers);
  useEffect(() => {
    function handleOnlineUser(onlineUsers: OnlineUser[]) {
      let userEntry = onlineUsers.find((entry) => entry.userId === profile._id);
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
  }, [onlineUsers, profile._id]);
  return (
    <div className=" flex flex-row items-center gap-2">
      <div className=" rounded-full relative">
        <img
          src={
            profile?.avatar
              ? profile.avatar?.url
              : "/images/avatars/default.png"
          }
          alt={profile?.name}
          className=" h-8 w-8 rounded-full"
        />
        {userOnlineStatus && (
          <div className=" bg-[#12AD2B] h-[10px] w-[10px] rounded-full absolute right-0 bottom-1 border border-white " />
        )}
      </div>
      <p className=" flex-1 text-xs">{profile?.name}</p>
    </div>
  );
};
