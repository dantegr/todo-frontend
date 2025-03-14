import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Subtask } from "../../../types/listType";
import { v4 as uuidv4 } from "uuid";

interface SubtaskProps {
  subtask: Subtask;
  onUpdate: (updatedSubtask: Subtask) => void;
  onDelete: (updatedSubtask: Subtask) => void;
}

const SubTaskItem: React.FC<SubtaskProps> = ({
  subtask,
  onUpdate,
  onDelete,
}) => {
  const [localSubtask, setLocalSubtask] = useState<Subtask>({
    ...subtask,
    subtasks: subtask.subtasks || [],
  });

  const handleChange = (field: keyof Subtask, value: unknown) => {
    const updatedSubtask = { ...localSubtask, [field]: value };
    setLocalSubtask(updatedSubtask);
    onUpdate(updatedSubtask);
  };

  const addNestedSubtask = () => {
    const newSubtask: Subtask = {
      id: uuidv4(),
      title: "New Nested Subtask",
      done: false,
      required: false,
      subtasks: [],
    };
    handleChange("subtasks", [...(localSubtask.subtasks || []), newSubtask]);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} ml={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          data-testid="subtask-title-input"
          label="Subtask Title"
          value={localSubtask.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          margin="dense"
          size="small"
        />
        <RadioGroup
          data-testid="subtask-required-group"
          row
          value={localSubtask.required ? "required" : "optional"}
          onChange={(e) =>
            handleChange("required", e.target.value === "required")
          }
        >
          <FormControlLabel
            data-testid="subtask-required-radio"
            value="required"
            control={<Radio size="small" />}
            label="Required"
          />
          <FormControlLabel
            data-testid="subtask-optional-radio"
            value="optional"
            control={<Radio size="small" />}
            label="Optional"
          />
        </RadioGroup>
        <IconButton
          data-testid="subtask-delete-button"
          onClick={() => onDelete(localSubtask)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton
          data-testid="subtask-add-nested-button"
          onClick={addNestedSubtask}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      {localSubtask.subtasks?.map((nestedSubtask, index) => (
        <SubTaskItem
          key={index}
          subtask={nestedSubtask}
          onUpdate={(updatedSubtask) => {
            const updatedSubtasks = [...(localSubtask.subtasks || [])];
            updatedSubtasks[index] = updatedSubtask;
            handleChange("subtasks", updatedSubtasks);
          }}
          onDelete={(updatedSubtask) => {
            const updatedSubtasks = [...(localSubtask.subtasks || [])];
            const index = updatedSubtasks.findIndex(
              (sub) => sub.id === updatedSubtask.id
            );
            if (index !== -1) {
              updatedSubtasks.splice(index, 1);
              handleChange("subtasks", updatedSubtasks);
            }
          }}
        />
      ))}
    </Box>
  );
};

export default SubTaskItem;
