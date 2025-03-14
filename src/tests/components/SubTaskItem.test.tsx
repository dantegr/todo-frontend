import { render, screen, fireEvent } from "@testing-library/react";
import { vi, it, expect, describe } from "vitest";
import SubTaskItem from "../../pages/home/components/SubTaskItem";
import { Subtask } from "../../types/listType";

describe("SubTaskItem", () => {
  const mockSubtask: Subtask = {
    id: "1",
    title: "Test Subtask",
    done: false,
    required: false,
    subtasks: [],
  };

  const mockProps = {
    subtask: mockSubtask,
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  };

  it("should render subtask title", () => {
    render(<SubTaskItem {...mockProps} />);
    const titleInput = screen
      .getByTestId("subtask-title-input")
      .querySelector("input");
    expect(titleInput).toHaveValue("Test Subtask");
  });

  it("should handle title change", () => {
    render(<SubTaskItem {...mockProps} />);
    const titleInput = screen
      .getByTestId("subtask-title-input")
      .querySelector("input");
    fireEvent.change(titleInput!, { target: { value: "Updated Title" } });

    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockSubtask,
      title: "Updated Title",
    });
  });

  it("should handle required/optional toggle", () => {
    render(<SubTaskItem {...mockProps} />);
    const requiredRadio = screen.getByTestId("subtask-required-radio");
    fireEvent.click(requiredRadio);

    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockSubtask,
      required: true,
    });
  });

  it("should handle deletion", () => {
    render(<SubTaskItem {...mockProps} />);
    const deleteButton = screen.getByTestId("subtask-delete-button");
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockSubtask);
  });

  it("should add nested subtask", () => {
    render(<SubTaskItem {...mockProps} />);
    const addButton = screen.getByTestId("subtask-add-nested-button");
    fireEvent.click(addButton);

    expect(mockProps.onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockSubtask,
        subtasks: expect.arrayContaining([
          expect.objectContaining({
            title: "New Nested Subtask",
            done: false,
            required: false,
          }),
        ]),
      })
    );
  });
});
