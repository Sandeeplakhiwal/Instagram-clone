// LoadingIndicator.tsx
import React from "react";

const RunningBorder: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50">
      <style>
        {`
          @keyframes runningBorder {
            0% {
              background-position: 0% 0;
            }
            100% {
              background-position: 100% 0;
            }
          }
        `}
      </style>
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8a2be2, #0000ff, #ff7f00, #ff0000, #ffff00)",
          backgroundSize: "500% 100%",
          animation: "runningBorder 4s linear infinite",
        }}
      ></div>
    </div>
  );
};

export default RunningBorder;
