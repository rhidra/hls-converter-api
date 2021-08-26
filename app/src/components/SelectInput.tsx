import { FC } from "react";
import { FaCaretDown } from 'react-icons/fa';

type Props = {
  id?: string;
  onChange: (v: string) => void;
  label?: string;
  value: string;
  options: {
    label: string,
    value: string,
  }[];
};

const SelectInput: FC<Props> = ({onChange, value, options, id, label}) => {

  return (
    <div className="select">
      {label &&
        <label htmlFor={id}>{label}</label>
      }

      <div className="select-box">
        <select name={id} id={id} value={value} onChange={v => onChange(v.target.value)}>
          {options.map(({label, value}) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <div className="caret">
          <FaCaretDown/>
        </div>
      </div>
    </div>
  );
}

export default SelectInput;