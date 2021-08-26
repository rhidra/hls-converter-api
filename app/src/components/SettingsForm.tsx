import { FC, useState } from "react";
import Select from "./Select";

const SettingsForm: FC = () => {
  const [encodingSpeed, setEncodingSpeed] = useState('medium');
  const [segmentSize, setSegmentSize] = useState('6');
  const [framerate, setFramerate] = useState('25');

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
      <Select
        id="segment-size"
        label="Segments size"
        value={segmentSize}
        onChange={v => setSegmentSize(v)}
        options={[
          {value: '2', label: '2'},
          {value: '4', label: '4'},
          {value: '6', label: '6 (recommanded)'},
          {value: '8', label: '8'},
          {value: '10', label: '10'},
        ]}
      />
      <Select
        id="framerate"
        label="Framerate"
        value={framerate}
        onChange={v => setFramerate(v)}
        options={[
          {value: '23', label: '23.976'},
          {value: '24', label: '24'},
          {value: '25', label: '25'},
          {value: '30', label: '30'},
          {value: '60', label: '60'},
          {value: '120', label: '120'},
        ]}
      />
    </form>
    </>
  );
};

export default SettingsForm;