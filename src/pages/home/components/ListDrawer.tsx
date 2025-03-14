import React, { useEffect, useState } from "react";
import { TodoList, Item } from "../../../types/listType";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  List,
  FormControl,
  InputLabel,
  Select,
  Divider,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

interface IPropps {
  list: TodoList | null;
  handleCloseDrawer: () => void;
  saveDrawerList: (list: TodoList | null) => void;
}

const ListDrawer: React.FC<IPropps> = ({
  list,
  handleCloseDrawer,
  saveDrawerList,
}) => {
  const [updatedList, setUpdatedList] = useState<TodoList | null>(list);
  const [filter, setFilter] = useState<string>("none");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedList) {
      setUpdatedList({ ...updatedList, title: event.target.value });
    }
  };

  const handleSaveList = async () => {
    saveDrawerList(updatedList);
  };

  const handleAddTask = () => {
    const newItem: Item = {
      id: uuidv4(),
      title: "New Item",
      done: false,
      cost: 0,
      subtasks: [],
    };

    const newItems = updatedList?.items;
    newItems?.push(newItem);
    if (updatedList) {
      setUpdatedList({ ...updatedList, items: newItems ? newItems : [] });
    }
  };

  const handleUpdateItem = (item: Item) => {
    const newItems: Item[] = updatedList!.items;
    const itemIndex = newItems.findIndex((el) => el.id === item.id);
    newItems[itemIndex] = item;

    if (updatedList) {
      setUpdatedList({ ...updatedList, items: newItems ? newItems : [] });
    }
  };

  const deleteListItem = (itemId: string) => {
    if (updatedList) {
      const newItems = updatedList.items.filter((item) => item.id !== itemId);
      setUpdatedList({ ...updatedList, items: newItems });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setUpdatedList((prevList) => {
        if (!prevList) return prevList;
        const oldIndex = prevList.items.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = prevList.items.findIndex(
          (item) => item.id === over.id
        );
        const newItems = arrayMove(prevList.items, oldIndex, newIndex);
        return { ...prevList, items: newItems };
      });
    }
  };

  const filteredItems = updatedList?.items.filter((item) => {
    if (filter === "completed") return item.done;
    if (filter === "in_progress") return !item.done;
    return true;
  });

  useEffect(() => {
    setUpdatedList(list);
  }, [list]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          Edit List
        </Typography>

        <IconButton
          data-testid="close-drawer-button"
          onClick={handleCloseDrawer}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "red",
            color: "white",
            borderRadius: "8px",
            width: "30px",
            height: "30px",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Box
        sx={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          Title:
        </Typography>
        <TextField
          data-testid="list-title-input"
          fullWidth
          variant="outlined"
          value={updatedList?.title || ""}
          onChange={handleTitleChange}
          disabled={updatedList?.completed || updatedList?.frozen}
        />
      </Box>
      <Box
        sx={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {`Total Cost: ${updatedList?.items.reduce(
            (total, item) => total + (item.cost || 0),
            0
          )}`}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Filter</InputLabel>
            <Select
              data-testid="filter-select"
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              defaultValue={"none"}
              inputProps={{
                name: "Filter",
                id: "uncontrolled-native",
              }}
              disabled={updatedList?.completed || updatedList?.frozen}
            >
              <MenuItem value={"none"}>None</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in_progress"}>In progress</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          data-testid="add-task-button"
          variant="contained"
          color="success"
          onClick={handleAddTask}
          sx={{ width: "calc(100% - 32px)" }}
          disabled={updatedList?.completed || updatedList?.frozen}
        >
          Add task
        </Button>
      </Box>
      <Divider />

      <Box
        data-testid="list-items-container"
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          marginBottom: "16px",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {!(
          updatedList?.completed ||
          updatedList?.frozen ||
          filter !== "none"
        ) ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={
                (updatedList?.items || [])
                  .map((item) => item.id)
                  .filter((id) => id !== undefined) as string[]
              }
              strategy={verticalListSortingStrategy}
            >
              <List className="App__TodoListItems">
                {filteredItems?.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    deleteListItem={deleteListItem}
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>
        ) : (
          <List className="App__TodoListItems">
            {filteredItems?.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                handleUpdateItem={handleUpdateItem}
                deleteListItem={deleteListItem}
              />
            ))}
          </List>
        )}
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          width: "calc(100% - 32px)",
        }}
      >
        <Button
          data-testid="save-list-button"
          variant="contained"
          color="primary"
          onClick={handleSaveList}
          sx={{ width: "calc(100% - 32px)", margin: "0 16px", padding: "12px" }}
          disabled={updatedList?.completed || updatedList?.frozen}
        >
          Save List
        </Button>
      </Box>
    </Box>
  );
};

export default ListDrawer;
