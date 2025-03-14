import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach, afterEach, Mock } from "vitest";
import Home from "../../pages/home/Home";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext";
import { getUserById } from "../../api/userApi";
import { getUserLists, createNewList } from "../../api/listApi";

vi.mock("../../stores/AuthContext");
vi.mock("../../api/userApi");
vi.mock("../../api/listApi");
vi.mock("socket.io-client", () => ({
  default: () => ({
    on: vi.fn(),
    emit: vi.fn(),
  }),
}));

describe("Home Component", () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      userId: "123",
      accessToken: "token",
      logout: vi.fn(),
    });

    (getUserById as Mock).mockResolvedValue({
      _id: "123",
      username: "testuser",
      email: "test@example.com",
    });

    (getUserLists as Mock).mockResolvedValue({
      data: [{ _id: "1", title: "List 1" }],
    });

    (createNewList as Mock).mockResolvedValue({
      data: { _id: "2", title: "New List" },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the home component", async () => {
    expect(getUserById).toHaveBeenCalledWith("123", "token");
    await waitFor(() => {
      expect(getUserLists).toHaveBeenCalledWith("123", "token");
    });
  });

  it("should handle list creation", async () => {
    fireEvent.click(screen.getByTestId("add-list-button"));
    fireEvent.change(screen.getByLabelText("List Title"), {
      target: { value: "New List" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(createNewList).toHaveBeenCalledWith("123", "New List", "token");
  });

  it("should handle logout", () => {
    const { logout } = useAuth();

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(logout).toHaveBeenCalled();
  });
});
