export interface CustomField {
  title: string;
  value: string | number | boolean;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  required: boolean;
  subtasks?: Subtask[]; // Recursive type for nesting
}

export interface Item {
  id: string;
  title: string;
  done: boolean;
  cost: number;
  required: boolean;
  type?: string;
  customFields?: CustomField[];
  subtasks: Subtask[];
}

export interface TodoList {
  _id: string;
  title: string;
  ownerId: string;
  sharedWith: string[];
  frozen: boolean;
  completed: boolean;
  items: Item[];
  createdAt: string; // Date string from timestamps
  updatedAt: string; // Date string from timestamps
}
