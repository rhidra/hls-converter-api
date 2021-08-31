import { FC } from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout: FC = ({children}) => {
  return (
    <div className="main-layout">
      <Header/>

      {children}

      <Footer/>
    </div>
  );
};

export default Layout;