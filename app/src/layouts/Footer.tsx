import { FC } from "react";
import { FaGithub } from 'react-icons/fa';

const Footer: FC = () => {
  return (
    <footer>
      <a href="/" target="_blank" className="github">
        <FaGithub/>&nbsp;
        Github
      </a>

      <div className="credit">
        Created by<br/>
        Rémy Hidra
      </div>

      <a href="/" target="_blank" className="portfolio">
        <img src="https://img.icons8.com/ios-glyphs/30/000000/fire-element--v1.png" width="24px" alt="Flame icon"/>&nbsp;
        More projects
      </a>
    </footer>
  );
};

export default Footer;