import { FC, useState } from "react";

interface FooterPropsTypes {
  caption: string;
  username: string;
}

const Footer: FC<FooterPropsTypes> = ({ caption, username }) => {
  const [moreTogle, setMoreTogle] = useState(false);
  return (
    <div className=" p-4 pt-2 pb-1 flex align-middle">
      <span
        className={`mr-2 font-bold ${
          moreTogle ? null : "whitespace-nowrap overflow-hidden text-ellipsis"
        }`}
      >
        {username} <span className=" italic font-normal">{caption}</span>
      </span>
      <span
        className=" text-gray-base cursor-pointer"
        onClick={() => setMoreTogle(!moreTogle)}
      >
        {moreTogle ? "less" : "more"}
      </span>
    </div>
  );
};

export default Footer;
