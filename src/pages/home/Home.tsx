import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Drawer from "@mui/material/Drawer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { Alert, List, useMediaQuery, useTheme } from "@mui/material";
import Cookies from "js-cookie";
import { useAuth } from "../../stores/AuthContext";
import { getUserById } from "../../api/userApi";
import { getUserLists, createNewList } from "../../api/listApi";
import ListComp from "./components/ListComp";
import ListDrawer from "./components/ListDrawer";
import { TodoList } from "../../types/listType";
import io from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;

const socket = io(apiUrl, {
  transports: ["websocket", "polling", "flashsocket"],
});

socket.on("connect", () => {
  console.log("socket connected");
});

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [snackOpenState, setSnackOpenState] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [listTitle, setListTitle] = useState<string>("");

  const { userId, accessToken, logout } = useAuth();
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    email: string;
  } | null>(null);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [drawerList, setDrawerList] = useState<TodoList | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  const joinSocket = (userId: string) => {
    try {
      socket.emit("join", userId);
    } catch (error) {
      console.error("Error joining socket:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        const data = await getUserById(userId, accessToken);

        return data;
      };

      fetchUserData().then((result) => {
        setUser(result);
      });

      const fetchListData = async () => {
        const response = await getUserLists(userId, accessToken);

        return response.data;
      };

      fetchListData().then((result) => {
        setLists(result);
      });

      joinSocket(userId);

      socket.on("listUpdated", (updatedList: TodoList) => {
        setLists((lists) => {
          const index = lists.findIndex((item) => item._id === updatedList._id);

          if (index === -1) return [...lists];

          const updatedlists = [...lists];
          updatedlists[index] = updatedList;
          return updatedlists;
        });

        setDrawerList((list) => {
          if (list && list._id === updatedList._id) {
            return updatedList;
          }
          return list;
        });
      });
    }
  }, []);

  const removeListFromState = (listId: string | null) => {
    const index = lists.findIndex((item) => item._id === listId);
    if (index === -1) return [...lists];

    const updatedlists = [...lists];
    updatedlists.splice(index, 1);
    setLists(updatedlists);
  };

  const updateListInState = (listId: string | null, updatedList: TodoList) => {
    const index = lists.findIndex((item) => item._id === listId);

    if (index === -1) return [...lists];

    const updatedlists = [...lists];
    updatedlists[index] = updatedList;
    setLists(updatedlists);
  };

  const handleCloseSnackBar = () => {
    setSnackOpenState(false);
  };

  const handleLogout = () => {
    Cookies.remove("userId");
    Cookies.remove("accessToken");
    logout();
    window.location.reload();
  };

  const handleOpenDrawer = (list: TodoList) => {
    setDrawerList(list);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setDrawerList(null);
    setShowDrawer(false);
  };

  const handleCreateNewList = async () => {
    try {
      const response = await createNewList(userId, listTitle, accessToken);
      const updatedlists = [...lists, response.data];
      setLists(updatedlists);
      setSnackOpenState(true);
    } catch (e) {
      console.log(e);
    }
  };

  const saveUpdatedList = (list: TodoList | null) => {
    try {
      socket.emit("updateList", { userId, updatedToDoList: list });
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setListTitle("");
  };

  const handleConfirmCreateList = () => {
    handleCreateNewList();
    handleCloseDialog();
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <AppBar position="static">
          <Toolbar>
            <img
              style={{ maxHeight: "1.6rem", marginRight: "10px" }}
              src="/todo.svg"
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`Welcome ${user?.username}!`}
            </Typography>
            <Tooltip title="Create new list">
              <Button
                name="+"
                color="inherit"
                sx={{
                  border: "2px solid",
                  transitionDuration: "0.4s",
                  "&:hover": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
                onClick={handleOpenDialog}
                data-testid="add-list-button"
              >
                +
              </Button>
            </Tooltip>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          marginBottom: "16px",
          width: "100%",
        }}
      >
        <List className="App__TodoList">
          {lists.map((list) => (
            <ListComp
              key={list._id}
              list={list}
              removeListFromState={removeListFromState}
              updateListInState={updateListInState}
              handleOpenDrawer={handleOpenDrawer}
              saveUpdatedList={saveUpdatedList}
            />
          ))}
        </List>
      </Box>
      <Snackbar
        open={snackOpenState}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}
      >
        <Alert severity="success">New list was created!</Alert>
      </Snackbar>
      <Drawer
        anchor="right"
        open={showDrawer}
        sx={{
          width: isMobile ? "100%" : "40%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "40%",
          },
        }}
        onClose={handleCloseDrawer}
      >
        <ListDrawer
          list={drawerList}
          handleCloseDrawer={handleCloseDrawer}
          saveDrawerList={saveUpdatedList}
        />
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Create New List</DialogTitle>
        <DialogContent>
          <Typography>Input a title for your new list:</Typography>
          <TextField
            label="List Title"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            name="create"
            onClick={handleConfirmCreateList}
            variant="contained"
            color="success"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
