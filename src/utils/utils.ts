import { Subtask } from "../types/listType";

export const updateSubtaskRecursively = (
  subtasks: Subtask[],
  updatedSubtask: Subtask
): Subtask[] => {
  return subtasks.map((sub) => {
    if (sub.id === updatedSubtask.id) {
      return updatedSubtask;
    }
    if (sub.subtasks) {
      return {
        ...sub,
        subtasks: updateSubtaskRecursively(sub.subtasks, updatedSubtask),
      };
    }
    return sub;
  });
};

export const removeSubtaskRecursively = (
  subtasks: Subtask[],
  subtaskToRemove: Subtask
): Subtask[] => {
  return subtasks
    .filter((sub) => sub.id !== subtaskToRemove.id)
    .map((sub) => {
      if (sub.subtasks && sub.subtasks.length > 0) {
        return {
          ...sub,
          subtasks: removeSubtaskRecursively(sub.subtasks, subtaskToRemove),
        };
      }
      return sub;
    });
};
