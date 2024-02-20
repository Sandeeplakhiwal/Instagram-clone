import { Link, useNavigate, useParams } from "react-router-dom";
import * as PageRoutes from "../constants/routes";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removeUser } from "../redux/slices/userSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../apis";
import { RootState } from "../redux/store";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { io } from "socket.io-client";
import { Message } from "./inbox/directMessageBox";
import { increaseMessagesCount } from "../redux/slices/messagesSlice";
import { addNewMessage } from "../redux/slices/exampleSlice";
import {
  getUserMessagesIndex,
  getUserMessagesSenderIndex,
} from "../pages/direct";
import {
  addUserOnlineTiming,
  removeUserOnlineTiming,
} from "../redux/slices/onlineUserSlice";

// export const socket = io("https://anontalks-backend-production.up.railway.app");
export const socket = io("http://localhost:5000");

interface HeaderProps {
  setMessages?: Dispatch<SetStateAction<Message[]>>;
  messages?: Message[];
}

type UserEntry = {
  userId: string;
  socketId?: string;
  timing: {
    from: string;
    to: string;
  };
};

const Header: FC<HeaderProps> = ({ setMessages }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { messagesCount } = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams();

  const userMessagesInRedux = useSelector(
    (state: RootState) =>
      state.example.userMessages[
        getUserMessagesIndex(state.example.userMessages, user ? user._id : "")
      ]?.messages[
        getUserMessagesSenderIndex(
          state.example.userMessages[
            getUserMessagesIndex(
              state.example.userMessages,
              user ? user._id : ""
            )
          ].messages,
          id ? id : ""
        )
      ]?.contents
  );

  const { refetch: logoutRefetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutApi,
    enabled: false,
  });

  const handleLogout = async () => {
    try {
      await logoutRefetch();
      dispatch(removeUser());
      queryClient.resetQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully");
      navigate(PageRoutes.LOGIN);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    if (isAuthenticated) {
      socket.emit("user_connected", user?._id);
    }

    // Listen for user_online event
    socket.on("user_online", (userEntry: UserEntry) => {
      dispatch(
        addUserOnlineTiming({
          userId: userEntry.userId,
          from: userEntry.timing?.from,
          to: userEntry.timing.to,
        })
      );
    });

    // Listen for online_users event
    socket.on("online_users", (onlineUsers: UserEntry[]) => {
      onlineUsers.forEach((entry) =>
        dispatch(
          addUserOnlineTiming({
            userId: entry.userId,
            from: entry.timing.from,
            to: entry.timing.to,
          })
        )
      );
    });

    // Listen for user_offline event
    socket.on("user_offline", (userEntry: UserEntry) => {
      dispatch(
        removeUserOnlineTiming({
          userId: userEntry.userId,
          to: userEntry.timing.to ? userEntry.timing.to : "",
        })
      );
    });

    return () => {
      console.log("Offline");
    };
  }, [user, isAuthenticated]);

  const receiveSound = new Audio("/sounds/receiveMessageSound.mp3");
  const notificationAudio = new Audio("/sounds/notificationSound.mp3");

  useEffect(() => {
    const handlePrivateMessageReceive = (data: Message) => {
      // dispatch(addMessage(data));
      dispatch(
        addNewMessage({
          sender: data.sender,
          recipient: data.recipient,
          content: data.content,
          createdAt: data.createdAt,
          userId: user ? user._id : "",
        })
      );
      dispatch(increaseMessagesCount(data.sender));
      if (setMessages) {
        setMessages(userMessagesInRedux);
      }
      // Play the receive message sound
      receiveSound.play();

      // Send notification with custom sound
      if (Notification.permission === "granted") {
        new Notification("New Message", {
          body: `You have received a new message`,
          silent: true,
          icon: "/favicon.ico",
          timestamp: Date.now(),
        });
        notificationAudio.play();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("New Message", {
              body: `You have received a new message`,
              silent: true,
              icon: "/favicon.ico",
              timestamp: Date.now(),
            });
            notificationAudio.play();
          }
        });
      }
    };

    socket.on("private_message_receive", handlePrivateMessageReceive);

    return () => {
      socket.off("private_message_receive", handlePrivateMessageReceive);
    };
  }, [dispatch]);

  return (
    <header className="h-16 bg-white border-b border-gray-primary mb-2 sticky top-0 max-w-screen-2xl mx-auto z-50 pr-1">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between w-full h-full">
          <div className="text-gray-700 text-center flex items-center align-middle cursor-pointer">
            <h1>
              <Link to={PageRoutes.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="Instagram"
                  className="mt-2 w-6/12"
                  title="instagram-logo"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 textcenter flex items-center align-middle">
            {isAuthenticated ? (
              <>
                <Link to={PageRoutes.DASHBOARD} className=" mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Link>
                <Link to={PageRoutes.SEARCH} className=" mr-2">
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
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </Link>
                <Link to={PageRoutes.INBOX} className=" mr-2">
                  <div className=" relative">
                    {messagesCount.length >= 1 ? (
                      <span className=" absolute bottom-3 left-3 bg-red-primary rounded-full px-1 text-xs text-white  ">
                        {messagesCount.length}
                      </span>
                    ) : null}
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
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                      />
                      {/* <circle
                      cx="18"
                      cy="6"
                      r="5"
                      fill="white"
                      stroke="white"
                      stroke-width="1"
                    /> */}
                      {/* <text
                      x="16"
                      y="10"
                      fill="red"
                      font-size="15"
                      font-weight="bold"
                      stroke="red"
                      stroke-width="1"
                    >
                      16
                    </text> */}
                    </svg>
                  </div>
                </Link>
                <button
                  type="button"
                  title="Sign Out"
                  onClick={handleLogout}
                  className="w-9 text-center pl-0.5 mr-2"
                >
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
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>
                </button>
                {user && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${user?.name}/${user?._id}`}>
                      <img
                        src={
                          user?.avatar
                            ? user.avatar.url
                            : "/images/avatars/default.png"
                        }
                        alt="avatar"
                        className="rounded-full h-8 w-8 flex"
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={PageRoutes.LOGIN}>
                  <button
                    className=" bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 text-center"
                    title="Log In"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={PageRoutes.SIGN_UP}>
                  <button
                    title="Sign Up"
                    className=" font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
