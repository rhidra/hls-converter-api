import { FC } from "react";

type Props = {
  label?: string;
  sublabel?: string;
};

const Loader: FC<Props> = ({label, sublabel}) => {
  return (
    <>
    <span className="loader-label">
      {label ?? 'Loading'}
    </span>
    {sublabel &&
      <span className="loader-sublabel">
        {sublabel}
      </span>
    }

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