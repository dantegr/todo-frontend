import React from "react";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TodoList } from "../../../types/listType";
import { useAuth } from "../../../stores/AuthContext";
import { deleteListFromDb } from "../../../api/listApi";

interface IPropps {
  list: TodoList;
  removeListFromState: (listId: string | null) => void;
}
const ListComp: React.FC<IPropps> = ({ list, removeListFromState }) => {
  const { userId, accessToken } = useAuth();
  const deleteList = async (listId: string | null) => {
    try {
      const response = await deleteListFromDb(userId, listId, accessToken);
      console.log(response);
      removeListFromState(listId);
    } catch (e) {
      if (typeof e === "string") {
        e.toUpperCase(); // works, `e` narrowed to string
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.name); // works, `e` narrowed to Error
      }
    }
  };

  return (
    <>
      <ListItem
        key={list._id}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={() => deleteList(list._id)}
          >
            <DeleteIcon />
          </IconButton>
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
