import { Dispatch, RefObject, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  filteredTodos: Todo[];
  inputRef: RefObject<HTMLInputElement>;

  handleSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleSetError: (error: ErrorMessages) => void;
  handleSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useDeleteTodos = ({
  filteredTodos,
  inputRef,

  handleSetPreparedTodos,
  handleSetError,
  handleSetTodoIdLoading,
}: Props) => {
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const handleDeleteTodos = async (id: number) => {
    try {
      handleSetTodoIdLoading(prev => [...prev, id]);
      await deleteTodos(id);
      handleSetPreparedTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      handleSetError(ErrorMessages.Delete);
    } finally {
      handleSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    completedTodos.map(todo => handleDeleteTodos(todo.id));
  };

  return { handleDeleteTodos, handleDeleteAllCompletedTodos };
};
