import { FC } from "react";

const Loader: FC = () => {
  return (
    <>
    <span className="loader-label">Loading</span>

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