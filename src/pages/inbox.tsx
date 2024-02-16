import { useEffect, useState } from "react";
import Header from "../components/header";
import { Message } from "../components/inbox/directMessageBox";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DirectMessageSidebar from "../components/inbox/directMessageSidebar";
import NewMessageBox from "../components/inbox/newMessageBox";

function Inbox() {
  useEffect(() => {
    document.title = "Inbox • Chats";
  }, []);

  const { user } = useSelector((state: RootState) => state.user);

  const messagesInRedux = useSelector(
    (state: RootState) => state.message.messages
  );
  const [messages, setMessages] = useState<Message[]>(messagesInRedux);
  console.log(messages);

  return (
    <>
      <Header setMessages={setMessages} />
      <div className=" flex flex-row sm:px-2 max-w-screen-2xl mx-auto overflow-hidden overflow-y-hidden lg:h-[87vh] md:h-[88vh] sm:h-screen h-[85vh] -mt-2">
        <div className=" h-screen w-3/12 bg-white pt-2 border border-gray-primary ">
          <div className=" px-2 flex flex-row items-center sm:justify-between justify-center mb-2">
            <p className="font-bold text-[14px] hidden sm:block ">
              {user && user.name}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-default"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
          <div className=" py-2 pl-2 hidden sm:block">
            <p className=" font-bold text-[13px] ">Messages</p>
          </div>
          <div
            className=" h-full overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <DirectMessageSidebar />
          </div>
        </div>
        <div className=" flex flex-grow h-full">
          <NewMessageBox />
        </div>
      </div>
    </>
  );
}

export default Inbox;
