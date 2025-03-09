import React, { useState } from "react";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { TodoList } from "../../../types/listType";
import { useAuth } from "../../../stores/AuthContext";
import { deleteListFromDb, updateFreezeInDb } from "../../../api/listApi";

interface IPropps {
  list: TodoList;
  removeListFromState: (listId: string | null) => void;
  updateListInState: (listId: string | null, updatedList: TodoList) => void;
}
const ListComp: React.FC<IPropps> = ({
  list,
  removeListFromState,
  updateListInState,
}) => {
  const { userId, accessToken } = useAuth();

  const deleteList = async (listId: string | null) => {
    try {
      const response = await deleteListFromDb(userId, listId, accessToken);
      console.log(response);
      removeListFromState(listId);
    } catch (e) {
      if (typeof e === "string") {
        e.toUpperCase();
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

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
      console.log(response);
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
                      onClick={() => handleFreeze()}
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
                      onClick={() => handleFreeze()}
                    >
                      Freeze
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => deleteList(list._id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        disablePadding={true}
      >
        <ListItemButton>
          {/*   <ListItemIcon>
            <Checkbox
              checked={todo.completed}
              onChange={(event) =>
                setTodoCompleted(todo.id, event.target.checked)
              }
            />
          </ListItemIcon> */}
          <ListItemText
            primary={
              /*  <div
                className={todo.completed ? "App__TodoItemText--Completed" : ""}
              > */
              <div>{list.title}</div>
            }
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default ListComp;
