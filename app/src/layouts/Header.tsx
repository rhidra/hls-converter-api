import { FC } from "react"

const Header: FC = () => {
  return (
    <header>
      <nav className="header">
        <a href="/">
          <h1 className="title">
            <img className="title" src="/img/logo.svg" alt="logo"/>
            HLS Converter
          </h1>
        </a>
        <a href="https://rapidapi.com/rhidra/api/hls-converter" target="_blank" className="call-to-action" rel="noreferrer">
          <img src="/img/rapidapi-badge-dark.png" width="200" alt="Connect on RapidAPI"/>
        </a>
      </nav>

      <div className="slogan">
        Convert any video to a <strong>HLS stream</strong>
      </div>
    </header>
  );
}

export default Header;