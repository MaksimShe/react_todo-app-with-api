import { updateTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  preparedTodos: Todo[];

  handleSetTodoIdLoading: (id: number[]) => void;
  handleSetError: (error: ErrorMessages) => void;
};

export const useUpdateTodo = ({
  preparedTodos,

  handleSetTodoIdLoading,
  handleSetError,
}: Props) => {
  const handleUpdateTodos = async (id: number, text: string) => {
    if (!text.trim()) {
      handleSetError(ErrorMessages.EmptyTitle);

      return;
    }

    const origilalTitle: string = preparedTodos.find(i => i.id).title;
    const preparedForUpdate: Todo = preparedTodos.find(i => i.id === id);

    preparedForUpdate.title = text.trim();
    handleSetTodoIdLoading([id]);
    try {
      await updateTodos({ ...preparedForUpdate }, id);
    } catch (err) {
      handleSetError(ErrorMessages.Update);
      preparedForUpdate.title = origilalTitle;
    } finally {
      handleSetTodoIdLoading([]);
    }
  };

  return { handleUpdateTodos };
};
