import React from "react";
import SuggestedProfile from "./suggestedProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface SuggestionsProps {
  users: any[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ users = [] }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className=" rounded flex flex-col">
      <div className=" text-sm flex items-center align-middle justify-between mb-2">
        <p className=" font-bold text-gray-base">
          {" "}
          {user?.followers.length === 0 && user?.following.length === 0
            ? "Popular"
            : null}{" "}
          Suggestions for you
        </p>
      </div>
      <div className=" mt-4 grid gap-5">
        {users.map((user) => (
          <SuggestedProfile
            key={user._id}
            avatar={"/images/avatars/dali.jpg"}
            userName={user?.name}
            _id={user?._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
