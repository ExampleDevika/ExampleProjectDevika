import { Response } from 'express';
import { todoMapper } from './todo';
import { isAdmin } from '../../middleware/is-admin';
import { RequestContext } from '../../util/request-context.type';
import { Status, Todo } from '@baseline/types/todo';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import { getTodoByUserIdAndStatus, todoService } from './todo.service';

const app = createApp();
// app.use(isAdmin); // All private endpoints require the user to be an admin
export const handler = createAuthenticatedHandler(app);

app.post('/todo', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { status, message } = req.body as Todo;
      const todoData: Partial<Todo> = {
        userId: req.currentUserSub,
        status,
        message,
      };
      const todo = await todoService.create(todoData);
      res.json(todoMapper(todo));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to create todo ${message}`);
      res.status(400).json({ error: 'Failed to create todo' });
    }
  },
]);

app.patch('/todo', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { todoId, userId, status, message } = req.body as Todo;
      const todoData: Partial<Todo> = {
        todoId,
        userId,
        status,
        message,
      };
      const todo = await todoService.update(todoData);
      res.json(todoMapper(todo));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to update todo: ${message}`);
      res.status(400).json({
        error: 'Failed to update todo',
      });
    }
  },
]);

app.delete('/todo/:todoId', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const todoId = req.params.todoId;
      await todoService.delete(todoId);
      res.status(200);
      res.send();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to delete todo: ${message}`);
      res.status(400).json({
        error: 'Failed to delete todo',
      });
    }
  },
]);

app.get('/todo/my/:status', [
  async (req: RequestContext, res: Response) => {
    try {
      const { status } = req.params as {
        status: Status;
      };

      console.log(
        `Getting todos for user [${req.currentUserSub}] with status [${status}]`,
      );

      const todos = await getTodoByUserIdAndStatus(req.currentUserSub, status);

      return res.json(todos.map(todoMapper));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get todos: ${message}`);
      res.status(400).json({
        error: 'Failed to get todos',
      });
    }
  },
]);

app.get('/todo/:userId/:status', [
  async (req: RequestContext, res: Response) => {
    try {
      const { userId, status } = req.params as {
        userId: string;
        status: Status;
      };

      const todos = await getTodoByUserIdAndStatus(userId, status);

      return res.json(todos.map(todoMapper));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get todos: ${message}`);
      res.status(400).json({
        error: 'Failed to get todos',
      });
    }
  },
]);
