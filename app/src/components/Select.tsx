import { FC } from "react";
import { FaCaretDown } from 'react-icons/fa';

const Select: FC = () => {

  return (
    <div className="select">
      <label htmlFor="encoding-speed">Encoding speed</label>
      <div className="select-box">
        <select name="pets" id="encoding-speed">
            <option value="slow">Slow</option>
            <option value="medium" selected>Medium</option>
            <option value="fast">Fast</option>
        </select>

        <div className="caret">
          <FaCaretDown/>
        </div>
      </div>
    </div>
  );
}

export default Select;