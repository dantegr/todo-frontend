import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListTask from "./ListTask";
import { Item } from "../../../types/listType";

interface SortableItemProps {
  item: Item;
  handleUpdateItem: (item: Item) => void;
  deleteListItem: (itemId: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  handleUpdateItem,
  deleteListItem,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.index ?? `item-${Math.random()}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
    >
      <ListTask
        item={item}
        handleUpdateItem={handleUpdateItem}
        deleteListItem={deleteListItem}
      />
    </div>
  );
};

export default SortableItem;
