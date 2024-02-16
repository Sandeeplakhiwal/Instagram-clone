import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getPostsOfFollowingApi } from "../apis";
import ZigZagLoader from "./zigZagLoader";
import { Suspense, lazy } from "react";
import { User } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

const Post = lazy(() => import("./post"));

export interface PostTypes {
  readonly _id: string;
  image: {
    readonly public_id: string;
    url: string;
  };
  caption: string;
  owner: User;
  likes: any[];
  comments: any[];
  createdAt: Date;
}

function TimeLine() {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: followingPostsData, isLoading: followingPostsLoading } =
    useQuery({
      queryKey: ["postsOfFollowing"],
      queryFn: getPostsOfFollowingApi,
    });

  return (
    <div className=" container col-span-full md:col-span-2 px-3 md:px-0 ">
      {user?.following === undefined ? (
        <p></p>
      ) : user?.following.length === 0 && user?.post?.length === 0 ? (
        <p>Follow other people to see photos</p>
      ) : (
        <>
          {followingPostsLoading === true ? (
            <h3 className="  flex justify-center">
              <ZigZagLoader />
            </h3>
          ) : null}
          {followingPostsData?.data?.posts?.map((post: PostTypes) => (
            <Suspense>
              <Post
                key={post._id}
                image={post.image}
                caption={post.caption}
                owner={post.owner}
                likes={post.likes}
                comments={post.comments}
                postId={post._id}
                postDate={post.createdAt}
              />
            </Suspense>
          ))}
        </>
      )}
    </div>
  );
}

export default TimeLine;
