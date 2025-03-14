import axios from "axios";
import { vi, describe, it, expect, afterEach } from "vitest";
import {
  getUserLists,
  createNewList,
  deleteListFromDb,
  updateFreezeInDb,
  shareSelectedList,
} from "../../api/listApi";

describe("listApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch user lists", async () => {
    const getSpy = vi.spyOn(axios, "get");
    const mockResponse = { data: [{ id: "1", title: "List 1" }] };
    getSpy.mockResolvedValueOnce(mockResponse);

    const response = await getUserLists("userId", "accessToken");
    expect(response.data).toEqual(mockResponse.data);
    expect(getSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/userlists/userId`,
      {
        headers: { Authorization: "Bearer accessToken" },
      }
    );
  });

  it("should create a new list", async () => {
    const postSpy = vi.spyOn(axios, "post");
    const mockResponse = { data: { id: "1", title: "New List" } };
    postSpy.mockResolvedValueOnce(mockResponse);

    await createNewList("userId", "New List", "accessToken");

    expect(postSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/createlist`,
      { userId: "userId", listTitle: "New List" },
      { headers: { Authorization: "Bearer accessToken" } }
    );
  });

  it("should delete a list from the database", async () => {
    const deleteSpy = vi.spyOn(axios, "delete");
    const mockResponse = { data: { success: true } };
    deleteSpy.mockResolvedValueOnce(mockResponse);

    await deleteListFromDb("userId", "listId", "accessToken");

    expect(deleteSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/deletelist`,
      {
        headers: { Authorization: "Bearer accessToken" },
        data: { userId: "userId", listId: "listId" },
      }
    );
  });

  it("should update freeze status in the database", async () => {
    const putSpy = vi.spyOn(axios, "put");
    const mockResponse = { data: { success: true } };
    putSpy.mockResolvedValueOnce(mockResponse);

    await updateFreezeInDb("userId", "listId", true, "accessToken");

    expect(putSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/updateFreeze`,
      { userId: "userId", listId: "listId", frozen: true },
      { headers: { Authorization: "Bearer accessToken" } }
    );
  });

  it("should share a selected list", async () => {
    const postSpy = vi.spyOn(axios, "post");
    const mockResponse = { data: { success: true } };
    postSpy.mockResolvedValueOnce(mockResponse);

    await shareSelectedList("user@example.com", "listId", "accessToken");

    expect(postSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/sharelistwith`,
      { userEmail: "user@example.com", listId: "listId" },
      { headers: { Authorization: "Bearer accessToken" } }
    );
  });
});
