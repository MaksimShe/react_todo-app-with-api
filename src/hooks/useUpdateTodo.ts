import { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';
import { updateTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  preparedTodos: Todo[];

  handleSetTodoIdLoading: (id: number[]) => void;
  handleSetError: (error: ErrorMessages) => void;
  handleSetActiveForm: Dispatch<SetStateAction<number>>;
  editInputRef?: RefObject<HTMLInputElement | null> | undefined;
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
  const handleUpdateTodos = async (
    id: number,
    text: string,
    event?: FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    if (!text.trim()) {
      handleDeleteTodos(id);

      return;
    }

    const origilalTitle: string | null =
      preparedTodos.find(i => i.id === id)?.title || null;

    if (origilalTitle === null) {
      return;
    }

    if (origilalTitle === text) {
      handleSetActiveForm(-1);

      return;
    }

    const preparedForUpdate: Todo | undefined = preparedTodos.find(
      i => i.id === id,
    );

    if (!preparedForUpdate || !origilalTitle) {
      return;
    }

    preparedForUpdate.title = text.trim();
    handleSetTodoIdLoading([id]);
    try {
      await updateTodos({ ...preparedForUpdate }, id);
      handleSetActiveForm(-1);
    } catch (err) {
      handleSetError(ErrorMessages.Update);
      if (editInputRef) {
        editInputRef.current?.focus();
      }
    } finally {
      handleSetTodoIdLoading([]);
    }
  };

  return { handleUpdateTodos };
};
