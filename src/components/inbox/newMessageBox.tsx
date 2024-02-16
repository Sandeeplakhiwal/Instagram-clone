import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { searchUserProfile } from "../../apis";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../redux/slices/userSlice";
import ZigZagLoader from "../zigZagLoader";
import { Link } from "react-router-dom";

function NewMessageBox() {
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
    <div className=" h-full flex flex-col items-center justify-center mx-auto bg-white w-full">
      <img
        src="/images/newMessageImg.svg"
        alt="New-Message"
        className=" mb-2"
      />
      <h1 className=" text-xl font-normal mb-1">Your messages</h1>
      <p className=" text-gray-base">Send private messages to a friend</p>
      <button
        className=" bg-[#0095f6] hover:bg-[#0787db] text-white font-semibold px-4 py-1 text-center text-sm rounded-md mt-2 "
        onClick={handleOpenModal}
      >
        Send message
      </button>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
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
                    <div className=" flex flex-row items-center gap-2">
                      <div>
                        <img
                          src={
                            profile?.avatar
                              ? profile.avatar?.url
                              : "/images/avatars/default.png"
                          }
                          alt={profile?.name}
                          className=" h-8 w-8 rounded-full"
                        />
                      </div>
                      <p className=" flex-1 text-xs">{profile?.name}</p>
                    </div>
                    {/* <button className=" rounded-full  border border-gray-primary">
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
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button> */}
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
      </Modal>
    </div>
  );
}

export default NewMessageBox;

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  // Close modal when clicked outside of it
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
      onClose();
    }
  };

  // Close modal when escape key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setModalOpen(false);
      onClose();
    }
  };

  // Hide or show modal depending on isOpen prop
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  return modalOpen ? (
    <div
      className="fixed inset-0 bg-opacity-70 bg-black-light z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      onClick={handleCloseModal}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-5/6 max-w-lg mx-auto my-6">
        <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-center px-5 py-3 border-b border-solid border-gray-primary rounded-t">
            <h3 className="text-md font-bold text-center  w-full tracking-normal">
              New Message
            </h3>
            <button
              className="  items-center ml-auto bg-transparent border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => {
                setModalOpen(false);
                onClose();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="relative py-0 flex-auto">{children}</div>
        </div>
      </div>
    </div>
  ) : null;
};
