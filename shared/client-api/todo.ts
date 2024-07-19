import { Status, Todo } from '@baseline/types/todo';
import { RequestHandler } from './request-handler';

export const deleteTodo = async (
  requestHandler: RequestHandler,
  todoId: string,
): Promise<boolean> => {
  const response = await requestHandler.request<boolean>({
    method: 'DELETE',
    url: `todo/${todoId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const createTodo = async (
  requestHandler: RequestHandler,
  todo: Partial<Todo>,
): Promise<Todo> => {
  const response = await requestHandler.request<Todo>({
    method: 'POST',
    url: `todo`,
    hasAuthentication: true,
    data: todo,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const updateTodo = async (
  requestHandler: RequestHandler,
  todo: Partial<Todo>,
): Promise<Todo> => {
  const response = await requestHandler.request<Todo>({
    method: 'PATCH',
    url: `todo`,
    hasAuthentication: true,
    data: todo,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const getTodoByUserIdAndStatus = async (
  requestHandler: RequestHandler,
  userId: string,
  status: Status,
): Promise<Todo[]> => {
  const response = await requestHandler.request<Todo[]>({
    method: 'GET',
    url: `todo/${userId}/${status}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
};

export const getMyTodosByStatus = async (
  requestHandler: RequestHandler,
  status: Status,
): Promise<Todo[]> => {
  const response = await requestHandler.request<Todo[]>({
    method: 'GET',
    url: `todo/my/${status}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
};
