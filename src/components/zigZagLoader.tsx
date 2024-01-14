import React from "react";

const ZigZagLoader: React.FC = () => {
  return (
    <div className="h-10 w-10">
      <img
        src="/images/avatars/spinner.svg"
        alt="loader"
        className=" h-10 w-10 rounded-full outline-none "
      />
    </div>
  );
};

export default ZigZagLoader;

export const WhiteZigZagLoader = () => {
  return (
    <div className="h-4 w-4">
      <img
        src="/images/avatars/spinner.svg"
        alt="loader"
        className=" h-3 w-3 rounded-full outline-none "
      />
    </div>
  );
};
