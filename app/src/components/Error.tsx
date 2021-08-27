import { FC } from "react";

type Props = {
  error?: string;
  message?: string;
};

const Error: FC<Props> = ({error, message}) => {
  return (
    <main className="error">
      <div>
        <span className="error-title">{error ?? 'An error happened'} 😢</span>
        <span className="error-message">{message ?? 'Try again, or contact the administrator'}</span>
      </div>
    </main>
  );
};

export default Error;