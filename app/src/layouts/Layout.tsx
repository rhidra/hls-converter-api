import { FC } from "react";
import Header from "./Header";

const Layout: FC = ({children}) => {
  return (
    <div className="main-layout">
      <Header/>

      {children}
    </div>
  );
};

export default Layout;