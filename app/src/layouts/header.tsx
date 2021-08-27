import { FC } from "react"
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header>
      <nav className="header">
        <a href="/">
          <h1 className="title">HLS Converter</h1>
        </a>
        <a className="call-to-action">Access the API</a>
      </nav>

      <div className="slogan">
        Convert any video to a <strong>HLS stream</strong>
      </div>
    </header>
  );
}

export default Header;