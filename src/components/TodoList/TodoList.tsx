/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessages, Todo } from '../../types';
import cn from 'classnames';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';
import { useToggleTodo } from '../../hooks/useToggleTodo';
import { useUpdateTodo } from '../../hooks/useUpdateTodo';

type Props = {
  filteredTodos: Todo[];
  todoIdLoading: number[];
  inputRef;

  handleSetTodoIdLoading: (id: number[]) => void;
  handleSetError(error: ErrorMessages);
  handleSetPreparedTodos: (todos: Todo[]) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos, //use
  todoIdLoading, //jsx
  inputRef, //use

  handleSetTodoIdLoading, //use
  handleSetError, //use
  handleSetPreparedTodos, //use
}) => {
  const [isActiveForm, setIsActiveForm] = React.useState<number>();
  const [todoText, setTodoText] = React.useState<string>();

  const { handleDeleteTodos } = useDeleteTodos({
    filteredTodos,
    inputRef,

    handleSetPreparedTodos,
    handleSetError,
    handleSetTodoIdLoading,
  });

  const { handleToggleTodos } = useToggleTodo({
    preparedTodos: filteredTodos,

    handleSetIdTodoLoading: handleSetTodoIdLoading,
    handleSetError,
  });

  const { handleUpdateTodos } = useUpdateTodo({
    preparedTodos: filteredTodos,

    handleSetTodoIdLoading,
    handleSetError,
  });

  const changeInputField = (id, text) => {
    setIsActiveForm(id);
    setTodoText(text);
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleUpdateTodos(isActiveForm, todoText);
    setIsActiveForm(null);
  };

  const handleEsc = event => {
    if (event.key === 'Escape') {
      setIsActiveForm(null);
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleToggleTodos(todo.id)}
              />
            </label>

            {isActiveForm === todo.id ? (
              <form onSubmit={handleSubmit}>
                <input
                  data-cy="TodoTitleField"
                  className="todo__title-field"
                  type="text"
                  value={todoText}
                  onChange={e => setTodoText(e.target.value)}
                  autoFocus
                  onKeyDown={e => handleEsc(e)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => changeInputField(todo.id, todo.title)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodos(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': todoIdLoading.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
