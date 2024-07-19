import React, { useEffect, useState } from 'react';
import styles from './DashboardContent.module.scss';
import { Status, Todo } from '@baseline/types/todo';
import {
  createTodo,
  getMyTodosByStatus,
  getTodoByUserIdAndStatus,
  updateTodo,
} from '@baseline/client-api/todo';
import { getRequestHandler } from '@baseline/client-api/request-handler';

const DashboardContent = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [newMessage, setNewMessage] = useState('');

  const getAllTodos = async () => {
    const pendingTodos = await getMyTodosByStatus(
      getRequestHandler(),
      'pending',
    );

    const completedTodos = await getMyTodosByStatus(
      getRequestHandler(),
      'completed',
    );

    setTodos([...pendingTodos, ...completedTodos]);
  };

  const createNewTodo = async () => {
    await createTodo(getRequestHandler(), {
      status: 'pending',
      message: newMessage,
    });
    setNewMessage('');
    await getAllTodos();
  };

  const updateTodoOnClick = async (todo: Todo, newStatus: Status) => {
    await updateTodo(getRequestHandler(), {
      ...todo,
      status: newStatus,
    });
    await getAllTodos();
  };

  useEffect(() => {
    void getAllTodos();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        <div className={styles.preview}>
          {todos.map((todo) => (
            <div key={todo.todoId} className={styles.todo}>
              <input
                type="checkbox"
                checked={todo.status === 'completed'}
                onClick={() => {
                  void updateTodoOnClick(
                    todo,
                    todo.status === 'completed' ? 'pending' : 'completed',
                  );
                }}
              />
              <p>{todo.message}</p>
            </div>
          ))}
        </div>
        <div className={styles.preview}>
          <input
            type="text"
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={() => void createNewTodo()}>Add Todo</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
