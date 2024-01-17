import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";

interface UserProps {
  username: string;
  fullName: string;
  readonly userId: string;
}

const User: React.FC<UserProps> = ({ username, fullName, userId }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return !username || !fullName ? (
    <p></p>
  ) : (
    <Link
      to={`/p/${username}/${userId}`}
      className="flex flex-row gap-2 mb-6 items-center"
    >
      <div className="flex items-center  ">
        <img
          src={user?.avatar ? user.avatar?.url : "/images/avatars/default.png"}
          alt={user?.name}
          className=" rounded-full h-16 w-16 flex"
        />
      </div>
      <div className=" ">
        <p className=" font-bold text-sm">{username}</p>
        <p className=" text-sm">{fullName}</p>
      </div>
    </Link>
  );
};

export default User;
