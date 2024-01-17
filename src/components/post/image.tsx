import { FC } from "react";

interface ImageProps {
  src: string;
  caption: string;
}

const Image: FC<ImageProps> = ({ src, caption }) => {
  return (
    <img src={src} alt={caption} className=" h-96 mx-auto w-full md:w-6/12" />
  );
};

export default Image;
