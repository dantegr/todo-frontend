import { render, screen } from "@testing-library/react";
import { vi, it, expect, describe } from "vitest";
import SortableItem from "../../pages/home/components/SortableItem";
import { Item } from "../../types/listType";

// Mock the dnd-kit hooks
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: { "aria-describedby": "sortable-item" },
    listeners: { onDragStart: vi.fn() },
    setNodeRef: vi.fn(),
    transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    transition: "transform 250ms ease",
  }),
}));

// Mock the CSS utilities
vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: vi.fn().mockReturnValue("translate3d(0px, 0px, 0)"),
    },
  },
}));

describe("SortableItem", () => {
  const mockItem: Item = {
    id: "1",
    title: "Test Item",
    done: false,
    cost: 0,
    type: "task",
    customFields: [],
    subtasks: [],
  };

  const mockProps = {
    item: mockItem,
    handleUpdateItem: vi.fn(),
    deleteListItem: vi.fn(),
  };

  beforeEach(() => {
    render(<SortableItem {...mockProps} />);
  });

  it("should render sortable container", () => {
    const container = screen.getByTestId("sortable-item-container");
    expect(container).toBeInTheDocument();
  });

  it("should apply transform styles from useSortable", () => {
    const container = screen.getByTestId("sortable-item-container");
    expect(container).toHaveStyle({
      transform: "translate3d(0px, 0px, 0)",
      transition: "transform 250ms ease",
    });
  });
});
