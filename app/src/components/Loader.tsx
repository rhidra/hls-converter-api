import { FC } from "react";

type Props = {
  label?: string;
};

const Loader: FC<Props> = ({label}) => {
  return (
    <>
    <span className="loader-label">
      {label ?? 'Loading'}
    </span>

    <div className="loader">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </>
  );
};

export default Loader;