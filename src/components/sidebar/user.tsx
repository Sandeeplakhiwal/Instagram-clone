import React from "react";
import { Link } from "react-router-dom";

interface UserProps {
  username: string;
  fullName: string;
  readonly userId: string;
}

const User: React.FC<UserProps> = ({ username, fullName, userId }) => {
  return !username || !fullName ? (
    <p></p>
  ) : (
    <Link
      to={`/p/${username}/${userId}`}
      className="grid grid-cols-4 gap-4 mb-6 items-center"
    >
      <div className="flex items-center justify-between col-span-1">
        <img
          src="/images/avatars/karl.jpg"
          alt="karl"
          className=" rounded-full w-16 flex mr-3"
        />
      </div>
      <div className=" col-span-3">
        <p className=" font-bold text-sm">{username}</p>
        <p className=" text-sm">{fullName}</p>
      </div>
    </Link>
  );
};

export default User;
