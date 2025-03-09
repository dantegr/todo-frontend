import axios from "axios";
import { TodoList } from "../types/listType";

const apiUrl = import.meta.env.VITE_API_URL;

export const getUserLists = async (
  userId: string | null,
  accessToken: string | null
): Promise<TodoList[]> => {
  const response = await axios.get<TodoList[]>(
    `${apiUrl}/userlists/${userId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data;
};

export const createNewList = async (
  userId: string | null,
  accessToken: string | null
): Promise<TodoList> => {
  const response = await axios.post<TodoList>(
    `${apiUrl}/createlist`,
    {
      userId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data;
};

export const deleteListFromDb = async (
  userId: string | null,
  listId: string | null,
  accessToken: string | null
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${apiUrl}/deletelist`,
    {
      data: {
        userId,
        listId,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data;
};

export const updateFreezeInDb = async (
  userId: string | null,
  listId: string | null,
  frozen: boolean,
  accessToken: string | null
): Promise<TodoList> => {
  const response = await axios.put<TodoList>(
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

  return response.data;
};
