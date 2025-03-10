import axios, { AxiosResponse } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getUserLists = async (
  userId: string | null,
  accessToken: string | null
): Promise<AxiosResponse> => {
  const response = await axios.get<AxiosResponse>(
    `${apiUrl}/userlists/${userId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response;
};

export const createNewList = async (
  userId: string | null,
  accessToken: string | null
): Promise<AxiosResponse> => {
  const response = await axios.post<AxiosResponse>(
    `${apiUrl}/createlist`,
    {
      userId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response;
};

export const deleteListFromDb = async (
  userId: string | null,
  listId: string | null,
  accessToken: string | null
): Promise<AxiosResponse> => {
  const response = await axios.delete<AxiosResponse>(`${apiUrl}/deletelist`, {
    data: {
      userId,
      listId,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response;
};

export const updateFreezeInDb = async (
  userId: string | null,
  listId: string | null,
  frozen: boolean,
  accessToken: string | null
): Promise<AxiosResponse> => {
  const response = await axios.put<AxiosResponse>(
    `${apiUrl}/updateFreeze`,
    {
      userId,
      listId,
      frozen,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response;
};

export const shareSelectedList = async (
  userEmail: string | null,
  listId: string | null,
  accessToken: string | null
): Promise<AxiosResponse> => {
  const response = await axios.post<AxiosResponse>(
    `${apiUrl}/sharelistwith`,
    {
      userEmail,
      listId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response;
};
