import { render, screen, fireEvent } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ListDrawer from "../../pages/home/components/ListDrawer";
import { TodoList, Item } from "../../types/listType";

// Mock the dnd-kit hooks and utilities
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCenter: vi.fn(),
  TouchSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  arrayMove: vi.fn(),
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock SortableItem component since it uses useSortable
vi.mock("../../pages/home/components/SortableItem", () => ({
  default: ({
    item,
    handleUpdateItem,
    deleteListItem,
  }: {
    item: Item;
    handleUpdateItem: (item: Item) => void;
    deleteListItem: (id: string) => void;
  }) => (
    <div data-testid={`sortable-item-${item.id}`}>
      <span>{item.title}</span>
      <button onClick={() => handleUpdateItem({ ...item, done: !item.done })}>
        Toggle
      </button>
      <button onClick={() => deleteListItem(item.id)}>Delete</button>
    </div>
  ),
}));

describe("ListDrawer", () => {
  const mockItem: Item = {
    id: "1",
    title: "Test Item",
    done: false,
    cost: 0,
    type: "task",
    customFields: [],
    subtasks: [],
  };

  const mockList: TodoList = {
    _id: "test-list",
    title: "Test List",
    items: [mockItem],
    completed: false,
    frozen: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "test-user",
    sharedWith: [],
  };

  const mockProps = {
    list: mockList,
    handleCloseDrawer: vi.fn(),
    saveDrawerList: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render list title and allow editing", () => {
    render(<ListDrawer {...mockProps} />);
    const titleInput = screen
      .getByTestId("list-title-input")
      .querySelector("input") as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe("Test List");

    fireEvent.change(titleInput, { target: { value: "Updated List Title" } });
    expect(titleInput.value).toBe("Updated List Title");
  });

  it("should handle filter changes", () => {
    render(<ListDrawer {...mockProps} />);

    const filterSelect = screen.getByTestId("filter-select");
    expect(filterSelect).toBeInTheDocument();

    fireEvent.mouseDown(filterSelect.querySelector('[role="combobox"]')!);

    const completedOption = screen.getByRole("option", { name: /completed/i });
    fireEvent.click(completedOption);

    expect(filterSelect.querySelector("input")).toHaveValue("completed");
  });

  it("should add new task when clicking add task button", () => {
    render(<ListDrawer {...mockProps} />);
    const addTaskButton = screen.getByTestId("add-task-button");
    expect(addTaskButton).toBeInTheDocument();

    const initialItemsCount = screen.getAllByTestId(/^sortable-item-/).length;
    fireEvent.click(addTaskButton);
    const newItemsCount = screen.getAllByTestId(/^sortable-item-/).length;
    expect(newItemsCount).toBe(initialItemsCount + 1);
  });

  it("should save list when clicking save button", () => {
    render(<ListDrawer {...mockProps} />);
    const saveButton = screen.getByTestId("save-list-button");
    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton);
    expect(mockProps.saveDrawerList).toHaveBeenCalled();
  });

  it("should close drawer when clicking close button", () => {
    render(<ListDrawer {...mockProps} />);
    const closeButton = screen.getByTestId("close-drawer-button");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(mockProps.handleCloseDrawer).toHaveBeenCalled();
  });

  it("should disable editing when list is completed", () => {
    const completedList = {
      ...mockList,
      completed: true,
    };

    render(<ListDrawer {...mockProps} list={completedList} />);

    const titleInput = screen
      .getByTestId("list-title-input")
      .querySelector("input");
    const addTaskButton = screen.getByTestId("add-task-button");
    const filterSelect = screen
      .getByTestId("filter-select")
      .querySelector("input");

    expect(titleInput).toHaveAttribute("disabled");
    expect(addTaskButton).toHaveAttribute("disabled");
    expect(filterSelect).toHaveAttribute("disabled");
  });

  it("should disable editing when list is frozen", () => {
    const frozenList = {
      ...mockList,
      frozen: true,
    };

    render(<ListDrawer {...mockProps} list={frozenList} />);

    const titleInput = screen
      .getByTestId("list-title-input")
      .querySelector("input");
    const addTaskButton = screen.getByTestId("add-task-button");
    const filterSelect = screen
      .getByTestId("filter-select")
      .querySelector("input");

    expect(titleInput).toHaveAttribute("disabled");
    expect(addTaskButton).toHaveAttribute("disabled");
    expect(filterSelect).toHaveAttribute("disabled");
  });

  it("should calculate and display total cost", () => {
    const listWithCost = {
      ...mockList,
      items: [
        { ...mockItem, cost: 10 },
        { ...mockItem, id: "2", cost: 20 },
      ],
    };

    render(<ListDrawer {...mockProps} list={listWithCost} />);

    expect(screen.getByText("Total Cost: 30")).toBeInTheDocument();
  });
});
