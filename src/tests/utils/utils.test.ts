import { describe, it, expect } from "vitest";
import {
  updateSubtaskRecursively,
  removeSubtaskRecursively,
} from "../../utils/utils";
import { Subtask } from "../../types/listType";

describe("utils", () => {
  const sampleSubtasks: Subtask[] = [
    {
      id: "1",
      title: "Subtask 1",
      done: false,
      required: false,
      subtasks: [
        {
          id: "1.1",
          title: "Nested Subtask 1.1",
          done: false,
          required: false,
          subtasks: [],
        },
      ],
    },
    {
      id: "2",
      title: "Subtask 2",
      done: false,
      required: false,
      subtasks: [],
    },
  ];

  it("should update a subtask recursively", () => {
    const updatedSubtask: Subtask = {
      id: "1.1",
      title: "Updated Nested Subtask 1.1",
      done: true,
      required: false,
      subtasks: [],
    };

    const updatedSubtasks = updateSubtaskRecursively(
      sampleSubtasks,
      updatedSubtask
    );

    expect(updatedSubtasks[0].subtasks?.[0]).toEqual(updatedSubtask);
  });

  it("should remove a subtask recursively", () => {
    const subtaskToRemove: Subtask = {
      id: "1.1",
      title: "Nested Subtask 1.1",
      done: false,
      required: false,
      subtasks: [],
    };

    const updatedSubtasks = removeSubtaskRecursively(
      sampleSubtasks,
      subtaskToRemove
    );

    expect(updatedSubtasks[0].subtasks?.length).toBe(0);
  });
});
