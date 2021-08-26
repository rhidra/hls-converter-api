import { FC } from "react";
import { EncodingSettings, EncodingSpeed } from "../types";
import SelectInput from "./SelectInput";
import StreamsSelector from "./StreamsSelector";

type Props = {
  value: EncodingSettings;
  onChange: (v: EncodingSettings) => void;
};

const SettingsForm: FC<Props> = ({value, onChange}) => {

  return (
    <>
    <div className="col">
      <SelectInput
        id="encoding-speed"
        label="Encoding speed"
        value={`${value.encodingSpeed}`}
        onChange={v => onChange({...value, encodingSpeed: parseInt(v)})}
        options={[
          {value: `${EncodingSpeed.SLOW}`, label: 'Slow'},
          {value: `${EncodingSpeed.MEDIUM}`, label: 'Medium'},
          {value: `${EncodingSpeed.FAST}`, label: 'Fast'},
        ]}
      />
      <SelectInput
        id="segment-size"
        label="Segments size"
        value={`${value.segmentSize}`}
        onChange={v => onChange({...value, segmentSize: parseInt(v)})}
        options={[
          {value: '2', label: '2'},
          {value: '4', label: '4'},
          {value: '6', label: '6 (recommanded)'},
          {value: '8', label: '8'},
          {value: '10', label: '10'},
        ]}
      />
      <SelectInput
        id="framerate"
        label="Framerate"
        value={`${value.framerate}`}
        onChange={v => onChange({...value, framerate: parseInt(v)})}
        options={[
          {value: '23', label: '23.976'},
          {value: '24', label: '24'},
          {value: '25', label: '25'},
          {value: '30', label: '30'},
          {value: '60', label: '60'},
          {value: '120', label: '120'},
        ]}
      />
    </div>
    <div className="col">
      <StreamsSelector
        value={value.streams}
        onChange={v => onChange({...value, streams: v})}
      />
    </div>
    </>
  );
};

export default SettingsForm;