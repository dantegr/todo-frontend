import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ListTask from "../../pages/home/components/ListTask";
import { Item, Subtask } from "../../types/listType";

// Mock the SubTaskItem component
vi.mock("../../pages/home/components/SubTaskItem", () => ({
  default: ({
    subtask,
    onUpdate,
    onDelete,
  }: {
    subtask: Subtask;
    onUpdate: (subtask: Subtask) => void;
    onDelete: (subtask: Subtask) => void;
  }) => (
    <div data-testid={`subtask-${subtask.id}`}>
      <span>{subtask.title}</span>
      <button onClick={() => onUpdate({ ...subtask, done: !subtask.done })}>
        Toggle
      </button>
      <button onClick={() => onDelete(subtask)}>Delete Subtask</button>
    </div>
  ),
}));

describe("ListTask", () => {
  const mockItem: Item = {
    id: "1",
    title: "Test Task",
    done: false,
    cost: 10,
    type: "task",
    customFields: [
      { title: "Priority", value: "High" },
      { title: "Due Date", value: "2024-03-20" },
    ],
    subtasks: [
      {
        id: "sub-1",
        title: "Subtask 1",
        done: false,
        required: true,
      },
    ],
  };

  const mockProps = {
    item: mockItem,
    handleUpdateItem: vi.fn(),
    deleteListItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render task title and completion status", () => {
    render(<ListTask {...mockProps} />);
    const titleElement = screen.getByTestId("task-title");
    expect(titleElement).toHaveTextContent("Test Task");

    const checkbox = screen.getByTestId("task-checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should enter edit mode when clicking edit button", () => {
    render(<ListTask {...mockProps} />);
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);

    expect(screen.getByTestId("title-input")).toBeInTheDocument();
    expect(screen.getByTestId("cost-input")).toBeInTheDocument();
    expect(screen.getByTestId("type-select")).toBeInTheDocument();
  });

  it("should update title in edit mode", () => {
    render(<ListTask {...mockProps} />);

    fireEvent.click(screen.getByTestId("edit-button"));

    const titleInput = screen
      .getByTestId("title-input")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    fireEvent.click(screen.getByTestId("save-button"));

    expect(mockProps.handleUpdateItem).toHaveBeenCalledWith({
      ...mockItem,
      title: "Updated Task",
    });
  });

  it("should update cost in edit mode", () => {
    render(<ListTask {...mockProps} />);

    fireEvent.click(screen.getByTestId("edit-button"));

    const costInput = screen
      .getByTestId("cost-input")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(costInput, { target: { value: "20" } });

    fireEvent.click(screen.getByTestId("save-button"));

    expect(mockProps.handleUpdateItem).toHaveBeenCalledWith({
      ...mockItem,
      cost: 20,
    });
  });

  it("should delete custom fields", () => {
    render(<ListTask {...mockProps} />);

    fireEvent.click(screen.getByTestId("edit-button"));

    fireEvent.click(screen.getByTestId("delete-custom-field-0"));

    fireEvent.click(screen.getByTestId("save-button"));

    const expectedCustomFields = [mockItem.customFields![1]];

    expect(mockProps.handleUpdateItem).toHaveBeenCalledWith({
      ...mockItem,
      customFields: expectedCustomFields,
    });
  });

  it("should expand and show additional details", () => {
    render(<ListTask {...mockProps} />);

    fireEvent.click(screen.getByTestId("expand-button"));

    const expandedContent = screen.getByTestId("expanded-content");
    expect(expandedContent).toBeInTheDocument();

    expect(expandedContent).toHaveTextContent(`Type: ${mockItem.type}`);
    expect(expandedContent).toHaveTextContent(`Cost: ${mockItem.cost}`);

    mockItem.customFields?.forEach((field, index) => {
      const fieldDisplay = screen.getByTestId(`custom-field-display-${index}`);
      expect(fieldDisplay).toHaveTextContent(`${field.title}: ${field.value}`);
    });
  });

  it("should delete the task", () => {
    render(<ListTask {...mockProps} />);
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(mockProps.deleteListItem).toHaveBeenCalledWith(mockItem.id);
  });

  it("should add and render subtasks", () => {
    render(<ListTask {...mockProps} />);

    fireEvent.click(screen.getByTestId("edit-button"));

    fireEvent.click(screen.getByTestId("add-subtask-button"));

    fireEvent.click(screen.getByTestId("save-button"));

    expect(mockProps.handleUpdateItem).toHaveBeenCalledWith({
      ...mockItem,
      subtasks: [
        ...mockItem.subtasks,
        expect.objectContaining({
          title: "New Subtask",
          done: false,
          required: false,
        }),
      ],
    });
  });
});
