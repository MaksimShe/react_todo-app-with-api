import { RefObject, useState, Dispatch, FormEvent } from 'react';
import { addTodos } from '../api/todos';
import { ErrorMessages, Todo, USER_ID } from '../types';

type Props = {
  handleSetError: (error: ErrorMessages) => void;
  handleSetIdTodoLoading: Dispatch<React.SetStateAction<number[]>>;
  handleSetDisableInput: (loading: boolean) => void;
  handlePreparedTodos: Dispatch<React.SetStateAction<Todo[]>>;
};

export const useAddTodo = ({
  handleSetError,
  handleSetIdTodoLoading,
  handleSetDisableInput,
  handlePreparedTodos,
}: Props) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (!inputText.trim()) {
      handleSetError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    };

    handleSetDisableInput(true);
    handlePreparedTodos(prev => [...prev, { ...newTodo, id: 0 }]); //create temp todo
    handleSetIdTodoLoading([0]);

    try {
      const response = await addTodos(newTodo);

      setInputText('');
      newTodo.id = response.id;
      handlePreparedTodos(prev => [...prev, { ...newTodo }]); //add newTodo in list
    } catch {
      handleSetError(ErrorMessages.Add);
    } finally {
      handleSetDisableInput(false);
      handleSetIdTodoLoading([]);
      handlePreparedTodos(prev => prev.filter(i => i.id !== 0)); //delete temp todo
      inputRef.current?.focus();
    }
  };

  return {
    inputText,
    setInputText,
    handleSubmit,
  };
};
