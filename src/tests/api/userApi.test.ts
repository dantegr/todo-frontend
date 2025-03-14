import axios from "axios";
import { vi, describe, it, expect, afterEach } from "vitest";
import {
  handleLoginApi,
  handleRegisterApi,
  getUserById,
} from "../../api/userApi";
import Cookies from "js-cookie";

vi.mock("axios");
vi.mock("js-cookie");

describe("userApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle login and set cookies", async () => {
    const postSpy = vi.spyOn(axios, "post");
    const mockResponse = { data: { userId: "123", accessToken: "token" } };
    postSpy.mockResolvedValueOnce(mockResponse);

    const result = await handleLoginApi("testuser", "password");

    expect(result).toEqual(mockResponse.data);
    expect(postSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/login`,
      {
        username: "testuser",
        password: "password",
      }
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "userId",
      "123",
      expect.any(Object)
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "accessToken",
      "token",
      expect.any(Object)
    );
  });

  it("should handle registration", async () => {
    const postSpy = vi.spyOn(axios, "post");
    const mockResponse = {
      status: 201,
      data: { message: "Registration successful" },
    };
    postSpy.mockResolvedValueOnce(mockResponse);

    const response = await handleRegisterApi(
      "testuser",
      "test@example.com",
      "password"
    );

    expect(response).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/register`,
      {
        username: "testuser",
        email: "test@example.com",
        password: "password",
      }
    );
  });

  it("should get user by ID", async () => {
    const getSpy = vi.spyOn(axios, "get");
    const mockResponse = {
      data: { _id: "123", username: "testuser", email: "test@example.com" },
    };
    getSpy.mockResolvedValueOnce(mockResponse);

    const result = await getUserById("123", "token");

    expect(result).toEqual(mockResponse.data);
    expect(getSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/getuser/123`,
      {
        headers: { Authorization: "Bearer token" },
      }
    );
  });
});
