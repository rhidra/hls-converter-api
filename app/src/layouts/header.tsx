import { FC } from "react"

const Header: FC = () => {
  return (
    <header>
      <nav className="header">
        <a href="/">
          <h1 className="title">
            <img className="title" src="/logo.svg" alt="logo"/>
            HLS Converter
          </h1>
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