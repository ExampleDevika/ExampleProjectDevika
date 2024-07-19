export type Status = 'pending' | 'completed';

export interface Todo {
  todoId: string;
  userId: string;
  status: Status;
  message: string;
}
