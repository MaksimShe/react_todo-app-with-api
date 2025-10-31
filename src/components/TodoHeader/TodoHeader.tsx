import cn from 'classnames';
import * as React from 'react';
import { useEffect } from 'react';
import { ErrorMessages, Todo } from '../../types';
import { useAddTodo } from '../../hooks/useAddTodo';
import { useToggleTodo } from '../../hooks/useToggleTodo';

type Props = {
  quantityActiveTasks: number;
  preparedTodos: Todo[];
  isDisabledInput: boolean;
  inputRef;

  handleSetError: (error: ErrorMessages) => void;
  handleSetIdTodoLoading: (id: number[]) => void;
  handleSetDisableInput: (loading: boolean) => void;
  handlePreparedTodos: (todos: Todo[]) => void;
};

export const TodoHeader: React.FC<Props> = ({
  quantityActiveTasks,
  preparedTodos,
  isDisabledInput,
  inputRef,

  handleSetError,
  handleSetIdTodoLoading,
  handleSetDisableInput,
  handlePreparedTodos,
}) => {
  const { inputText, setInputText, handleSubmit } = useAddTodo({
    handleSetError,
    handleSetIdTodoLoading,
    handleSetDisableInput,
    handlePreparedTodos,
  });

  const { toggleAllTodos } = useToggleTodo({
    preparedTodos,

    handleSetError,
    handleSetIdTodoLoading,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef, isDisabledInput]);

  return (
    <header className="todoapp__header">
      {preparedTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: quantityActiveTasks === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={event => handleSubmit(event, inputRef)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={inputText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setInputText(e.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
