import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Drawer from "@mui/material/Drawer";
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
      const response = await createNewList(userId, accessToken);
      const updatedlists = [...lists, response.data];
      setLists(updatedlists);
      setSnackOpenState(true);
    } catch (e) {
      console.log(e);
    }
  };

  const saveDrawerList = (list: TodoList | null) => {
    try {
      socket.emit("updateList", { userId, updatedToDoList: list });
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`Welcome to do list ${user?.username}!`}
            </Typography>
            <Tooltip title="Create new list">
              <Button
                color="inherit"
                sx={{
                  border: "2px solid",
                  transitionDuration: "0.4s",
                  "&:hover": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
                onClick={handleCreateNewList}
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
      <List className="App__TodoList">
        {lists.map((list) => (
          <ListComp
            key={list._id}
            list={list}
            removeListFromState={removeListFromState}
            updateListInState={updateListInState}
            handleOpenDrawer={handleOpenDrawer}
          />
        ))}
      </List>
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
          saveDrawerList={saveDrawerList}
        />
      </Drawer>
    </>
  );
};

export default Home;
