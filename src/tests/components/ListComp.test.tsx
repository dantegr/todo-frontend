import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach, Mock } from "vitest";
import ListComp from "../../pages/home/components/ListComp";
import { useAuth } from "../../stores/AuthContext";
import {
  deleteListFromDb,
  updateFreezeInDb,
  shareSelectedList,
} from "../../api/listApi";

vi.mock("../../stores/AuthContext");
vi.mock("../../api/listApi");

describe("ListComp", () => {
  const mockList = {
    _id: "1",
    title: "Test List",
    ownerId: "123",
    completed: false,
    frozen: false,
    items: [],
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockProps = {
    list: mockList,
    removeListFromState: vi.fn(),
    updateListInState: vi.fn(),
    handleOpenDrawer: vi.fn(),
    saveUpdatedList: vi.fn(),
  };

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      userId: "123",
      accessToken: "token",
    });

    (deleteListFromDb as Mock).mockResolvedValue({
      data: { message: "List deleted successfully" },
    });

    (updateFreezeInDb as Mock).mockResolvedValue({
      data: { message: "List freeze status updated" },
    });

    (shareSelectedList as Mock).mockResolvedValue({
      data: { ...mockList, shared: true },
    });
    render(<ListComp {...mockProps} />);
  });

  it("should render list title", () => {
    expect(screen.getByText("Test List")).toBeInTheDocument();
  });

  it("should handle list deletion", async () => {
    fireEvent.click(screen.getByTestId("delete-list-button"));
    fireEvent.click(screen.getByTestId("delete-list-confirm"));

    await waitFor(() => {
      expect(deleteListFromDb).toHaveBeenCalledWith("123", "1", "token");
      expect(mockProps.removeListFromState).toHaveBeenCalledWith("1");
    });
  });

  it("should handle list freeze/unfreeze", async () => {
    fireEvent.click(screen.getByTestId("freeze-list-button"));

    await waitFor(() => {
      expect(updateFreezeInDb).toHaveBeenCalledWith("123", "1", true, "token");
      expect(mockProps.updateListInState).toHaveBeenCalledWith("1", {
        ...mockList,
        frozen: true,
      });
    });
  });

  it("should handle list completion toggle", () => {
    fireEvent.click(screen.getByTestId("complete-list-checkbox"));

    expect(mockProps.updateListInState).toHaveBeenCalledWith("1", {
      ...mockList,
      completed: true,
    });
    expect(mockProps.saveUpdatedList).toHaveBeenCalledWith({
      ...mockList,
      completed: true,
    });
  });

  it("should handle list sharing", async () => {
    fireEvent.click(screen.getByTestId("share-list-button"));
    const emailInput = screen
      .getByTestId("share-email-input")
      .querySelector("input");
    fireEvent.change(emailInput!, {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("share-list-confirm"));

    await waitFor(() => {
      expect(shareSelectedList).toHaveBeenCalledWith(
        "test@example.com",
        "1",
        "token"
      );
      expect(mockProps.updateListInState).toHaveBeenCalledWith("1", {
        ...mockList,
        shared: true,
      });
    });
  });
});
