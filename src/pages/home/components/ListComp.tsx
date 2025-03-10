import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Checkbox,
  useMediaQuery,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import { TodoList } from "../../../types/listType";
import { useAuth } from "../../../stores/AuthContext";
import {
  deleteListFromDb,
  updateFreezeInDb,
  shareSelectedList,
} from "../../../api/listApi";

interface IPropps {
  list: TodoList;
  removeListFromState: (listId: string | null) => void;
  updateListInState: (listId: string | null, updatedList: TodoList) => void;
  handleOpenDrawer: (list: TodoList) => void;
  saveUpdatedList: (list: TodoList) => void;
}
const ListComp: React.FC<IPropps> = ({
  list,
  removeListFromState,
  updateListInState,
  handleOpenDrawer,
  saveUpdatedList,
}) => {
  const { userId, accessToken } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [shareEmail, setShareEmail] = useState<string>("");
  const [shareError, setShareError] = useState<string>("");

  const isMobile = useMediaQuery("(max-width:600px)");

  const deleteList = async (listId: string | null) => {
    try {
      const response = await deleteListFromDb(userId, listId, accessToken);
      console.log(response.data);
      removeListFromState(listId);
      setShowDeleteDialog(false);
    } catch (e) {
      if (typeof e === "string") {
        e.toUpperCase();
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const shareList = async () => {
    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(shareEmail)) {
      try {
        const response = await shareSelectedList(
          shareEmail,
          list._id,
          accessToken
        );
        updateListInState(response.data._id, response.data);
        setShowShareDialog(false);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          setShareError(e.response!.data.error);
        } else {
          console.log(e);
        }
      }
    } else {
      setShareError("Invalid email address");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShareError("");
    setShareEmail(event.target.value);
  };

  useEffect(() => {
    if (!showShareDialog) {
      setShareError("");
      setShareEmail("");
    }
  }, [showShareDialog]);

  const handleFreeze = async () => {
    const listToUpdate = list;
    if (list.frozen) {
      listToUpdate.frozen = false;
    } else {
      listToUpdate.frozen = true;
    }

    try {
      const response = await updateFreezeInDb(
        userId,
        listToUpdate._id,
        listToUpdate.frozen,
        accessToken
      );
      console.log(response.data);
      updateListInState(list._id, listToUpdate);
    } catch (e) {
      if (typeof e === "string") {
        e.toUpperCase();
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const handleComplete = () => {
    const listToUpdate = list;
    if (list.completed) {
      listToUpdate.completed = false;
    } else {
      listToUpdate.completed = true;
    }
    updateListInState(list._id, listToUpdate);
    saveUpdatedList(listToUpdate);
  };

  return (
    <>
      <ListItem
        key={list._id}
        secondaryAction={
          <>
            {userId === list.ownerId && (
              <>
                {list.frozen ? (
                  <Tooltip title="Unfreeze the list, making it mutable">
                    <Button
                      color="inherit"
                      sx={{
                        backgroundColor: "#006992",
                        color: "white",
                        transitionDuration: "0.4s",
                        "&:hover": {
                          backgroundColor: "#298AAA",
                          color: "white",
                        },
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleFreeze();
                      }}
                    >
                      Unfreeze
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Freeze the list, making it immutable">
                    <Button
                      color="inherit"
                      sx={{
                        backgroundColor: "#FF8888",
                        color: "white",
                        transitionDuration: "0.4s",
                        "&:hover": {
                          backgroundColor: "#FB5A5A",
                          color: "white",
                        },
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleFreeze();
                      }}
                    >
                      Freeze
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
            <Tooltip title="Share list with a friend">
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowShareDialog(true);
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete list">
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        disablePadding={true}
        onClick={() => handleOpenDrawer(list)}
      >
        <ListItemButton>
          <Checkbox
            color="success"
            checked={list.completed}
            onClick={(event) => {
              event.stopPropagation();
              handleComplete();
            }}
          />
          <ListItemText
            primary={
              <div>{`${list.title} ${
                list.completed && !isMobile ? ": COMPLETED" : ""
              }`}</div>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
      <Dialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Are you sure you want to delete this list?</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton
            onClick={() => {
              setShowDeleteDialog(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>{`By clicking the "${list.title}" list will be permanently deleted.`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setShowDeleteDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => deleteList(list._id)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showShareDialog}
        onClose={() => {
          setShowShareDialog(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share list with a friend</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton
            onClick={() => {
              setShowShareDialog(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>{`By clicking the "${list.title}" list will be permanently deleted.`}</Typography>
        </DialogContent>
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
            Email:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={shareEmail}
            onChange={handleEmailChange}
          />
        </Box>
        {shareError !== "" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "16px",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "red", fontSize: "x-small" }}
            >
              {shareError}
            </Typography>
          </Box>
        )}
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setShowShareDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => shareList()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListComp;
