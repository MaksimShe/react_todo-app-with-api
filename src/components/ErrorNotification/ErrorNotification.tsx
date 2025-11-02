import classNames from 'classnames';
import * as React from 'react';
import { ErrorMessages } from '../../types';

type Props = {
  currentError: string | null;
  handleError: (errorType: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  handleError,
}) => {
  React.useEffect(() => {
    if (!currentError) {
      return;
    }

    const timer = setTimeout(() => {
      handleError(ErrorMessages.WithoutError);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentError, handleError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !currentError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleError(ErrorMessages.WithoutError)}
      />
      {currentError}
    </div>
  );
};
