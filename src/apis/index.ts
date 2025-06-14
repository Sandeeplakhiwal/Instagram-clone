import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserMessages } from "../redux/slices/exampleSlice";

// const server: string =
//   "http://ec2-3-6-220-31.ap-south-1.compute.amazonaws.com:5000/api/v1";

// export const server: string = "http://localhost:5000/api/v1";

// const server: string =
//   "https://anontalks-backend.onrender.com/api/v1";
const server: string = "http://localhost:8080/api/v1";

interface loginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface queryKeyParams {
  queryKey: [string, string];
}

export const loginApi = (formData: loginCredentials) => {
  return axios.post(`${server}/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const authApi = () => {
  return axios.get(`${server}/me`, {
    withCredentials: true,
  });
};

export const logoutApi = () => {
  return axios.get(`${server}/logout`, {
    withCredentials: true,
  });
};

export const getPostsOfFollowingApi = () => {
  return axios.get(`${server}/following/posts`, {
    withCredentials: true,
  });
};

export const addCommentApi = (formData: { id: string; comment: string }) => {
  const { id } = formData;
  return axios.put(`${server}/post/comment/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const getPostCommentsApi = ({ queryKey }: queryKeyParams) => {
  const postId = queryKey[1];
  return axios.get(`${server}/post/comments/${postId}`, {
    withCredentials: true,
  });
};

export const likeDislikePostApi = ({ queryKey }: queryKeyParams) => {
  const postId = queryKey[1];
  return axios.get(`${server}/post/${postId}`, {
    withCredentials: true,
  });
};

export const getPostLikesApi = ({ queryKey }: queryKeyParams) => {
  const postId = queryKey[1];
  return axios.get(`${server}/post/likes/${postId}`, {
    withCredentials: true,
  });
};

export const getFollowSuggestionsApi = () => {
  return axios.get(`${server}/suggestions/follow`, {
    withCredentials: true,
  });
};

export const getPopularFollowSuggestionsApi = () => {
  return axios.get(`${server}/suggestions/popular/follow`, {
    withCredentials: true,
  });
};

export const followUserApi = ({ queryKey }: queryKeyParams) => {
  const userId = queryKey[1];
  return axios.get(`${server}/follow/${userId}`, {
    withCredentials: true,
  });
};

export const UseFollowUser = (id: string) => {
  return useQuery({ queryKey: ["Follow-user", id], queryFn: followUserApi });
};

export const createNewPostApi = (formData: object) => {
  return axios.post(`${server}/post/upload`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

interface deleteCommentApiParams {
  queryKey: [string, { postId: string; commentId: string }];
}

export const deleteCommentApi = ({ queryKey }: deleteCommentApiParams) => {
  const { postId, commentId } = queryKey[1];
  return axios.delete(`${server}/post/comment/${postId}/${commentId}`, {
    withCredentials: true,
  });
};

export const deletePostApi = ({ queryKey }: queryKeyParams) => {
  const postId = queryKey[1];
  return axios.delete(`${server}/post/${postId}`, {
    withCredentials: true,
  });
};

interface UpdateCaption {
  postId: string;
  caption: string;
}

export const updateCaptionApi = (formData: UpdateCaption) => {
  const { postId } = formData;
  const { caption } = formData;
  return axios.put(
    `${server}/post/update/${postId}`,
    { caption },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

export const searchUserProfile = ({ queryKey }: queryKeyParams) => {
  const keyword = queryKey[1];
  return axios.get(`${server}/profile/search?keyword=${keyword}`, {
    withCredentials: true,
  });
};

export const getMyPostsApi = () => {
  return axios.get(`${server}/my/posts`, {
    withCredentials: true,
  });
};

export const getMyProfileApi = () => {
  return axios.get(`${server}/me`, {
    withCredentials: true,
  });
};

export const getUserProfileApi = ({ queryKey }: queryKeyParams) => {
  const id: string = queryKey[1];
  return axios.get(`${server}/${id}`, {
    withCredentials: true,
  });
};

export const getUserPostsApi = ({ queryKey }: queryKeyParams) => {
  const id: string = queryKey[1];
  return axios.get(`${server}/user/posts/${id}`, {
    withCredentials: true,
  });
};

export const getUserFollowingsApi = ({ queryKey }: queryKeyParams) => {
  const id: string = queryKey[1];
  return axios.get(`${server}/user/followings/${id}`, {
    withCredentials: true,
  });
};

export const getUserFollowersApi = ({ queryKey }: queryKeyParams) => {
  const id: string = queryKey[1];
  return axios.get(`${server}/user/followers/${id}`, {
    withCredentials: true,
  });
};

export interface UpdateNameEmail {
  newName: string;
  newEmail: string;
}

export const updateNameEmailApi = (formData: UpdateNameEmail) => {
  return axios.put(`${server}/update/profile`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePasswordApi = (formData: UpdatePassword) => {
  return axios.put(`${server}/update/password`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

interface ChangeAvatar {
  avatar: string;
  id: string;
}

export const changeAvatarApi = (formData: ChangeAvatar) => {
  return axios.put(`${server}/update/profile/avatar`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const deleteMyProfileApi = () => {
  return axios.delete(`${server}/profile/delete/me`, {
    withCredentials: true,
  });
};

export const getUserNameByIdApi = ({ queryKey }: queryKeyParams) => {
  const id = queryKey[1];
  return axios.get(`${server}/username/${id}`);
};

export const backupUserMessagesApi = (userMessages: UserMessages) => {
  return axios.post(`${server}/backup-messages`, userMessages, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const getUserBackedupMessagesApi = () => {
  return axios.get(`${server}/backup/messages`, {
    withCredentials: true,
  });
};
