import { FC, useState } from "react";
import Select from "./Select";

const SettingsForm: FC = () => {
  const [encodingSpeed, setEncodingSpeed] = useState('medium');

  return (
    <>
    <form className="col">
      <Select
        id="encoding-speed"
        label="Encoding speed"
        value={encodingSpeed}
        onChange={v => setEncodingSpeed(v)}
        options={[
          {value: 'slow', label: 'Slow'},
          {value: 'medium', label: 'Medium'},
          {value: 'fast', label: 'Fast'},
        ]}
      />
    </form>
    </>
  );
};

export default SettingsForm;