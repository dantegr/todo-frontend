import React, { useEffect, useState } from "react";
import { TodoList, Item } from "../../../types/listType";
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
import ListTask from "./ListTask";

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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedList) {
      setUpdatedList({ ...updatedList, title: event.target.value });
    }
  };

  const handleSaveList = async () => {
    saveDrawerList(updatedList);
  };

  const handleAddTask = () => {
    const newIndex = updatedList?.items.length;
    const newItem: Item = {
      index: newIndex!,
      title: "New Item",
      done: false,
      cost: 0,
      required: false,
      subtasks: [],
    };

    const newItems = updatedList?.items;
    newItems?.push(newItem);
    if (updatedList) {
      setUpdatedList({ ...updatedList, items: newItems ? newItems : [] });
    }
  };

  /*  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (updatedList) {
      const updatedItems = updatedList.items;
      const [movedItem] = updatedItems.splice(fromIndex, 1);
      updatedItems.splice(toIndex, 0, movedItem);
      setUpdatedList({ ...updatedList, items: updatedItems });
    }
  }; */

  const handleUpdateItem = (item: Item) => {
    const newItems: Item[] = updatedList!.items;
    const itemIndex = newItems.findIndex((el) => el.index === item.index);
    newItems[itemIndex] = item;

    if (updatedList) {
      setUpdatedList({ ...updatedList, items: newItems ? newItems : [] });
    }
  };

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
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Filter</InputLabel>
            <Select
              label="Filter"
              defaultValue={"none"}
              inputProps={{
                name: "Filter",
                id: "uncontrolled-native",
              }}
              disabled={updatedList?.completed || updatedList?.frozen}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            >
              <MenuItem value={"none"}>None</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in_progress"}>In progress</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
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

      <List className="App__TodoListItems">
        {updatedList?.items.map((item) => (
          <ListTask item={item} handleUpdateItem={handleUpdateItem} />
        ))}
      </List>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          width: "calc(100% - 32px)",
        }}
      >
        <Button
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
