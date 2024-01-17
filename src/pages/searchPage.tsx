// SearchBar.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { useQuery } from "@tanstack/react-query";
import { searchUserProfile } from "../apis";
import { Link } from "react-router-dom";
import LittleLoader from "../components/littleLoader";
import { User } from "../redux/slices/userSlice";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [profiles, setProfiles] = useState<User[] | []>([]);

  const {
    data: searchData,
    error: searchError,
    refetch: searchRefetch,
    isSuccess: searchSuccess,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: searchUserProfile,
    enabled: false,
  });

  useEffect(() => {
    if (searchSuccess && searchData) {
      setProfiles(searchData?.data?.users);
    }
  }, [searchSuccess, searchData, searchError]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setTimeout(() => {
      searchRefetch();
    }, 500);
  };

  const handleSearch = () => {
    console.log(searchQuery);
    searchRefetch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="container w-full sm:w-9/12 mx-auto  h-[80%]">
        <div className=" flex flex-row text-center items-center  justify-center mb-4">
          <form
            className=" flex text-center bg-white m-1 rounded-md border border-blue-medium w-full sm:w-7/12 mx-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="p-2 outline-none rounded-md w-full"
              autoFocus={true}
            />
            {searchLoading ? <LittleLoader /> : null}
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-500  p-2 hover:bg-blue-600 outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 outline-none"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className=" flex flex-row items-center  justify-center mb-4">
          <ul className="flex flex-col bg-white m-1 rounded-md w-full sm:w-7/12 mx-4">
            {searchQuery && profiles.length === 0 ? (
              <p className=" text-center">No Results Found!</p>
            ) : (
              profiles.map((profile) => (
                <Link to={`/p/${profile?.name}/${profile?._id}`}>
                  <li
                    key={profile?._id}
                    className="  flex gap-4  rounded p-2 items-center  mb-1 hover:bg-[#efefef]"
                  >
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
                    <button className="  w-8 h-8 text-lg" type={"button"}>
                      X
                    </button>
                  </li>
                </Link>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
