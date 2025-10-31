import { Dispatch, SetStateAction } from 'react';
import { ErrorMessages, Todo } from '../types';
import { updateTodos } from '../api/todos';

type Props = {
  filteredTodos: Todo[];

  handleSetError: (error: ErrorMessages) => void;
  handleSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useToggleTodo = ({
  filteredTodos,

  handleSetTodoIdLoading,
  handleSetError,
}: Props) => {
  const handleToggleTodos = async (id: number) => {
    handleSetTodoIdLoading([id]);
    const preparedForUpdate = filteredTodos.find(i => i.id === id);

    try {
      await updateTodos({ ...preparedForUpdate, completed: true }, id);
      preparedForUpdate.completed = true;
    } catch (err) {
      handleSetError(ErrorMessages.Update);
    } finally {
      handleSetTodoIdLoading([]);
    }
  };

  return { handleToggleTodos };
};
