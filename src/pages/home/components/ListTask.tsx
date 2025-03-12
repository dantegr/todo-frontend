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
  InputLabel,
  FormControl,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Item, CustomField } from "../../../types/listType";

interface IPropps {
  item: Item;
  handleUpdateItem: (item: Item) => void;
  deleteListItem: (itemId: string) => void;
}
const ListTask: React.FC<IPropps> = ({
  item,
  handleUpdateItem,
  deleteListItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Item>(item);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleCheckboxChange = (checked: boolean) => {
    handleChange("done", checked);
    handleUpdateItem({ ...editedItem, done: checked });
  };

  const handleDelete = () => {
    if (item.id !== undefined) {
      deleteListItem(item.id);
    }
  };

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  return (
    <Card
      variant="outlined"
      sx={{
        margin: 0.5,
        padding: 0.5,
        borderRadius: "8px",
        borderColor:
          editedItem.type === "task"
            ? "brown"
            : editedItem.type === "food"
            ? "green"
            : editedItem.type === "item"
            ? "blue"
            : "default",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent={"flex-end"}>
          {!isEditing && (
            <>
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                size="small"
              >
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
              <Checkbox
                color="success"
                checked={editedItem.done}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                size="small"
              />
              <Typography
                variant="body2"
                sx={{ flexGrow: 1, fontSize: "0.8rem", fontWeight: "bold" }}
              >
                {`${editedItem.title} ${editedItem.done ? ": COMPLETED" : ""}`}
              </Typography>
            </>
          )}
          <IconButton onClick={() => setIsEditing(!isEditing)} size="small">
            {isEditing ? (
              <CloseIcon fontSize="small" />
            ) : (
              <EditIcon fontSize="small" />
            )}
          </IconButton>
          {!isEditing && (
            <IconButton onClick={handleDelete} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {isEditing && (
          <>
            <TextField
              label="Title"
              value={editedItem.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              margin="dense"
              size="small"
            />
            <TextField
              label="Cost"
              type="number"
              value={editedItem.cost}
              onChange={(e) => handleChange("cost", parseFloat(e.target.value))}
              fullWidth
              margin="dense"
              size="small"
            />
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="simple-select-label">Type</InputLabel>
              <Select
                label="Type"
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
            <Typography variant="subtitle2">Custom Fields</Typography>
            {editedItem.customFields?.map((field, index) => (
              <>
                <Box key={index} display="flex" alignItems="center" gap={1}>
                  <TextField
                    label="Field Title"
                    value={field.title}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "title", e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    size="small"
                  />
                  <TextField
                    label="Field Value"
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    size="small"
                  />
                  <IconButton
                    onClick={() => {
                      const newCustomFields = [
                        ...(editedItem.customFields || []),
                      ];
                      newCustomFields.splice(index, 1);
                      setEditedItem((prev) => ({
                        ...prev,
                        customFields: newCustomFields,
                      }));
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <RadioGroup
                  row
                  value={field.required ? "required" : "optional"}
                  onChange={(e) =>
                    handleCustomFieldChange(
                      index,
                      "required",
                      e.target.value === "required"
                    )
                  }
                >
                  <FormControlLabel
                    value="required"
                    control={<Radio size="small" />}
                    label="Required"
                  />
                  <FormControlLabel
                    value="optional"
                    control={<Radio size="small" />}
                    label="Optional"
                  />
                </RadioGroup>
              </>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addCustomField}
              size="small"
            >
              Add Custom Field
            </Button>
            <Typography variant="subtitle2">Subtasks</Typography>
            {/* {editedItem.subtasks.map((subtask, index) => (
              <ListTask key={index} item={subtask} />
            ))} */}
            <Button startIcon={<AddIcon />} onClick={addSubtask} size="small">
              Add Subtask
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={saveItem}
              sx={{ marginTop: 1 }}
              size="small"
            >
              Save
            </Button>
          </>
        )}
        {isExpanded && !isEditing && (
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box display="flex" justifyContent="center">
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
              >
                {`Type: ${editedItem.type ?? "---"}`}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
              >
                {`Cost: ${editedItem.cost}`}
              </Typography>
            </Box>
            {editedItem.customFields?.map((field, index) => (
              <Box key={index} display="flex" justifyContent="center">
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                >
                  {`${field.title}: ${field.value}${
                    field.required ? " *" : ""
                  }`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ListTask;
