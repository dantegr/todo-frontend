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
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Item, CustomField, Subtask } from "../../../types/listType";
import SubTaskItem from "./SubTaskItem";
import { v4 as uuidv4 } from "uuid";
import {
  removeSubtaskRecursively,
  updateSubtaskRecursively,
} from "../../../utils/utils";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<Item>(item);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
        ...(prev.subtasks || []),
        {
          id: uuidv4(),
          title: "New Subtask",
          done: false,
          cost: 0,
          required: false,
        },
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

  const updateSubTaskBasedOnId = (updatedSubtask: Subtask) => {
    const updatedSubtasks = updateSubtaskRecursively(
      editedItem.subtasks || [],
      updatedSubtask
    );

    handleUpdateItem({
      ...editedItem,
      subtasks: updatedSubtasks,
    });
  };

  const renderSubtasks = (subtasks: Subtask[]) => (
    <ul style={{ listStyleType: "none", paddingLeft: "1.5em" }}>
      {subtasks.map((subtask: Subtask, index: number) => (
        <li key={subtask.id || index}>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={subtask.done}
              onChange={(e) => {
                const updatedSubtask = {
                  ...subtask,
                  done: e.target.checked,
                };
                updateSubTaskBasedOnId(updatedSubtask);
                //saveItem();
              }}
              size="small"
            />
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {subtask.title}
              {subtask.required ? " *" : ""}
            </Typography>
          </Box>
          {subtask.subtasks?.length
            ? renderSubtasks(subtask.subtasks || [])
            : null}
        </li>
      ))}
    </ul>
  );

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
        overflow: "auto",
        scrollbarWidth: "thin", // For Firefox
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0,0,0,.2)",
        },
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
              onWheel={(event) => {
                event.preventDefault();
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || !isNaN(Number(value))) {
                  handleChange("cost", value === "" ? "" : Number(value));
                }
              }}
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
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
            <Divider sx={{ margin: "8px 0" }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2">Custom Fields</Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={addCustomField}
                size="small"
              >
                Add Custom Field
              </Button>
            </Box>
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
              </>
            ))}
            <Divider sx={{ margin: "8px 0" }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2">Subtasks</Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={addSubtask}
                size="small"
              >
                Add Subtask
              </Button>
            </Box>
            {editedItem.subtasks?.map((subtask) => (
              <>
                <SubTaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onUpdate={(updatedSubtask) => {
                    const updatedSubtasks = [...(editedItem.subtasks || [])];
                    const index = updatedSubtasks.findIndex(
                      (sub) => sub.id === updatedSubtask.id
                    );
                    if (index !== -1) {
                      updatedSubtasks[index] = updatedSubtask;
                      handleChange("subtasks", updatedSubtasks);
                    }
                  }}
                  onDelete={(updatedSubtask) => {
                    const updatedSubtasks = removeSubtaskRecursively(
                      editedItem.subtasks || [],
                      updatedSubtask
                    );
                    handleChange("subtasks", updatedSubtasks);
                  }}
                />
                <Divider />
              </>
            ))}
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveItem}
              sx={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
              }}
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
                  {`${field.title}: ${field.value}`}
                </Typography>
              </Box>
            ))}
            {editedItem.subtasks.length > 0 && (
              <Box gridColumn="span 2">
                <Typography variant="subtitle2">Subtasks:</Typography>
                {renderSubtasks(editedItem.subtasks || [])}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ListTask;
