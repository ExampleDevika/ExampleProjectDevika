import { Todo } from '@baseline/types/todo';

export const todoMapper = (data: Todo): Todo => {
  const todo: Todo = {
    todoId: data?.todoId,
    userId: data?.userId,
    status: data?.status,
    message: data?.message,
  };
  return todo;
};
