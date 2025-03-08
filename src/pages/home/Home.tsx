import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import { Alert, List } from "@mui/material";
import Cookies from "js-cookie";
import { useAuth } from "../../stores/AuthContext";
import { getUserById } from "../../api/userApi";
import { getUserLists, createNewList } from "../../api/listApi";
import ListComp from "./components/ListComp";
import { TodoList } from "../../types/listType";

const Home: React.FC = () => {
  const [snackOpenState, setSnackOpenState] = useState<boolean>(false);

  const { userId, accessToken, logout } = useAuth();
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    email: string;
  } | null>(null);
  const [lists, setLists] = useState<TodoList[]>([]);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        // get the data from the api
        const data = await getUserById(userId, accessToken);
        // convert data to json
        return data;
      };

      fetchUserData().then((result) => {
        setUser(result);
      });

      const fetchListData = async () => {
        // get the data from the api
        const data = await getUserLists(userId, accessToken);
        // convert data to json
        return data;
      };

      fetchListData().then((result) => {
        setLists(result);
      });
    }
  }, []);

  useEffect(() => {
    console.log(lists);
  }, [lists]);

  const removeListFromState = (listId: string | null) => {
    const index = lists.findIndex((item) => item._id === listId);
    if (index === -1) return [...lists];

    const updatedlists = [...lists];
    updatedlists.splice(index, 1);
    setLists(updatedlists);
  };

  const handleCloseSnackBar = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpenState(false);
  };

  const handleLogout = () => {
    Cookies.remove("userId");
    Cookies.remove("accessToken");
    logout();
    window.location.reload();
  };

  const handleCreateNewList = async () => {
    try {
      const response = await createNewList(userId, accessToken);
      console.log(response);

      setSnackOpenState(true);
    } catch (e) {
      console.log(e);
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
                  "&:hover": {
                    backgroundColor: "#00008B",
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
    </>
  );
};

export default Home;
