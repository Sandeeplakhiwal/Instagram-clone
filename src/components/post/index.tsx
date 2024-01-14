import { FC, useState } from "react";
import Actions from "./actions";
import Comments from "./comments";
import Footer from "./footer";
import Header from "./header";
import Image from "./image";
import { User } from "../../redux/slices/userSlice";

export interface PostProps {
  image: {
    public_id: string;
    url: string;
  };
  caption: string;
  owner: User;
  likes: any[];
  comments: any[];
  postId: string;
  postDate: Date;
}

const Post: FC<PostProps> = ({
  image,
  caption,
  owner,
  likes,
  comments,
  postId,
  postDate,
}) => {
  const [commentsSlice, setCommentsSlice] = useState(3);
  return (
    <div className=" rounded col-span-4 border bg-white border-gray-primary mb-12">
      <Header
        username={owner?.name}
        userAvatar={owner?.avatar.url}
        userId={owner?._id}
        postId={postId}
      />
      <Image src={image?.url} caption={caption} />
      <Actions
        totalLikes={likes}
        postId={postId}
        commentsSlice={commentsSlice}
        setCommentsSlice={setCommentsSlice}
      />
      <Footer caption={caption} username={owner?.name} />
      <Comments
        allComments={comments}
        userId={owner?._id}
        postId={postId}
        postDate={postDate}
        commentsSlice={commentsSlice}
        setCommentsSlice={setCommentsSlice}
      />
    </div>
  );
};

export default Post;
