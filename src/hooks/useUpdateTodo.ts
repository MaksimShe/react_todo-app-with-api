import { Dispatch, RefObject, SetStateAction } from 'react';
import { updateTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  preparedTodos: Todo[];

  handleSetTodoIdLoading: (id: number[]) => void;
  handleSetError: (error: ErrorMessages) => void;
  handleSetActiveForm: Dispatch<SetStateAction<number>>;
  editInputRef?: RefObject<HTMLInputElement | null>;
  handleDeleteTodos: (id: number) => void;
};

export const useUpdateTodo = ({
  preparedTodos,

  handleSetTodoIdLoading,
  handleSetError,
  handleSetActiveForm,
  handleDeleteTodos,
  editInputRef,
}: Props) => {
  const handleUpdateTodos = async (id: number, text: string, event = null) => {
    if (event) {
      event.preventDefault();
    }

    if (!text.trim()) {
      handleDeleteTodos(id);

      return;
    }

    const origilalTitle: string = preparedTodos.find(i => i.id === id).title;

    if (origilalTitle === text) {
      handleSetActiveForm(-1);

      return;
    }

    const preparedForUpdate: Todo = preparedTodos.find(i => i.id === id);

    preparedForUpdate.title = text.trim();
    handleSetTodoIdLoading([id]);
    try {
      await updateTodos({ ...preparedForUpdate }, id);
      handleSetActiveForm(-1);
    } catch (err) {
      handleSetError(ErrorMessages.Update);
      editInputRef.current?.focus();
      // preparedForUpdate.title = origilalTitle;
    } finally {
      handleSetTodoIdLoading([]);
    }
  };

  return { handleUpdateTodos };
};
