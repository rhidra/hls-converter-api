import { FC } from "react";
import {StreamQuality} from '../../types';
import SelectInput from "../../components/SelectInput";
import { FiPlus } from 'react-icons/fi';
import { FaTrashAlt } from "react-icons/fa";

type Props = {
  value: StreamQuality[];
  onChange: (v: StreamQuality[]) => void;
};

const StreamsSelector: FC<Props> = ({value, onChange}) => {
  function handleChange(v: string, streamIndex: number) {
    const q = parseInt(v) as StreamQuality;
    const newArr = value.slice(0, streamIndex).concat([q]).concat(value.slice(streamIndex+1, value.length));
    onChange(newArr);
  }

  function handleRemove(streamIndex: number) {
    const newArr = value.slice(0, streamIndex).concat(value.slice(streamIndex+1, value.length));
    onChange(newArr);
  }

  function handleAdd() {
    const newArr = value.concat([StreamQuality.MOBILE_240P]);
    onChange(newArr);
  }

  return (
    <div className="streams-selector">
      Streams
      {value.map((q, i) => (
        <div key={i} className="stream-row">
          <SelectInput
            id="streams-selector"
            value={`${q}`}
            onChange={(v) => handleChange(v, i)}
            options={[
              { value: `${StreamQuality.MOBILE_240P}`, label: '240p (Mobile)' },
              { value: `${StreamQuality.MOBILE_360P}`, label: '360p (Mobile)' },
              { value: `${StreamQuality.SD_480P}`, label: '480p (SD)' },
              { value: `${StreamQuality.SD_540P}`, label: '540p (SD)' },
              { value: `${StreamQuality.HD_720P}`, label: '720p (HD)' },
              { value: `${StreamQuality.HD_1080P}`, label: '1080p (Full HD)' },
            ]}
          />

          {i !== value.length - 1 &&
            <button className="remove" onClick={() => handleRemove(i)}>
              <FaTrashAlt/>
            </button>
          }
          {i === value.length - 1 &&
            <button disabled={value.length >= 5} onClick={() => handleAdd()}>
              <FiPlus/>
            </button>
          }
        </div>
      ))}
    </div>
  );
};

export default StreamsSelector;