import React, { useEffect, useState } from "react";
import { TodoList } from "../../../types/listType";
import { Box, IconButton, Typography, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
        />
      </Box>
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
        >
          Save List
        </Button>
      </Box>
    </Box>
  );
};

export default ListDrawer;
