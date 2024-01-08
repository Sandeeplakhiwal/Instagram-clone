import axios from "axios";

const server: string = "http://localhost:5000/api/v1";

interface loginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export const loginApi = (formData: loginCredentials) => {
  return axios.post(`${server}/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const signupApi = (formData: SignupCredentials) => {
  return axios.post(`${server}/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const authApi = () => {
  return axios.get(`${server}/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const logoutApi = () => {
  return axios.get(`${server}/logout`, {
    withCredentials: true,
  });
};
