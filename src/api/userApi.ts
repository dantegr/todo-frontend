import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

export const handleLoginApi = async (
  username: string,
  password: string
): Promise<{ userId: string; accessToken: string }> => {
  const response = await axios.post<{ userId: string; accessToken: string }>(
    `${apiUrl}/login`,
    {
      username,
      password,
    }
  );

  const { userId, accessToken } = response.data;
  const in60Minutes = new Date(new Date().getTime() + 60 * 60 * 1000);
  Cookies.set("userId", userId, { expires: in60Minutes });
  Cookies.set("accessToken", accessToken, { expires: in60Minutes });

  return { userId, accessToken };
};

export const handleRegisterApi = async (
  username: string,
  email: string,
  password: string
): Promise<AxiosResponse> => {
  const response = await axios.post<AxiosResponse>(`${apiUrl}/register`, {
    username,
    email,
    password,
  });

  return response;
};

export const getUserById = async (
  userId: string,
  accessToken: string | null
): Promise<{ _id: string; username: string; email: string }> => {
  const response = await axios.get<{
    _id: string;
    username: string;
    email: string;
  }>(`${apiUrl}/getuser/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { _id, username, email } = response.data;

  return { _id, username, email };
};
