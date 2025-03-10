import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { Item, CustomField } from "../../../types/listType";

interface IPropps {
  item: Item;
  handleUpdateItem: (item: Item) => void;
}
const ListTask: React.FC<IPropps> = ({ item, handleUpdateItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Item>(item);

  const handleChange = (field: keyof Item, value: unknown) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (
    index: number,
    field: keyof CustomField,
    value: unknown
  ) => {
    const newCustomFields = [...(editedItem.customFields || [])];
    newCustomFields[index] = { ...newCustomFields[index], [field]: value };
    setEditedItem((prev) => ({ ...prev, customFields: newCustomFields }));
  };

  /*   const handleSubtaskChange = (index: number, updatedSubtask: Subtask) => {
    const newSubtasks = [...editedItem.subtasks];
    newSubtasks[index] = updatedSubtask;
    setEditedItem((prev) => ({ ...prev, subtasks: newSubtasks }));
  }; */

  const addCustomField = () => {
    setEditedItem((prev) => ({
      ...prev,
      customFields: [
        ...(prev.customFields || []),
        { title: "", value: "", required: false },
      ],
    }));
  };

  const addSubtask = () => {
    setEditedItem((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { title: "New Subtask", done: false, cost: 0, required: false },
      ],
    }));
  };

  const saveItem = () => {
    handleUpdateItem(editedItem);
    setIsEditing(false);
  };

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  return (
    <Card
      variant="outlined"
      sx={{ margin: 2, padding: 2, borderRadius: "8px" }}
    >
      <CardContent>
        <Checkbox
          color="success"
          checked={editedItem.done}
          onChange={(e) => handleChange("done", e.target.checked)}
        />
        <Typography variant="body2">
          {`${editedItem.title} ${editedItem.done ? ": COMPLETED" : ""}`}
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            <EditIcon />
          </IconButton>
        </Typography>
        {isEditing ? (
          <>
            <TextField
              label="Title"
              value={editedItem.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cost"
              type="number"
              value={editedItem.cost}
              onChange={(e) => handleChange("cost", parseFloat(e.target.value))}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth>
              <InputLabel id="simple-select-label">Filter</InputLabel>
              <Select
                label="Filter"
                value={editedItem.type || "---"}
                onChange={(e) => handleChange("type", e.target.value)}
                fullWidth
              >
                <MenuItem value="---">---</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="item">Item</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1">Custom Fields</Typography>
            {editedItem.customFields?.map((field, index) => (
              <TextField
                key={index}
                label="Field Title"
                value={field.title}
                onChange={(e) =>
                  handleCustomFieldChange(index, "title", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            ))}
            <Button startIcon={<AddIcon />} onClick={addCustomField}>
              Add Custom Field
            </Button>
            <Typography variant="subtitle1">Subtasks</Typography>
            {/* {editedItem.subtasks.map((subtask, index) => (
              <ListTask key={index} item={subtask} />
            ))} */}
            <Button startIcon={<AddIcon />} onClick={addSubtask}>
              Add Subtask
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={saveItem}
              sx={{ marginTop: 2 }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <List>
              {editedItem.subtasks.map((subtask, index) => (
                <ListItem key={index}>{subtask.title}</ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ListTask;
