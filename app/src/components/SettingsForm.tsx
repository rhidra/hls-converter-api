import { FC } from "react";

const SettingsForm: FC = () => {
  return (
    <>
    <div>
      <label htmlFor="encoding-speed">Encoding speed</label>
      <select name="pets" id="encoding-speed">
          <option value="slow">Slow</option>
          <option value="medium" selected>Medium</option>
          <option value="fast">Fast</option>
      </select>
    </div>
    </>
  );
};

export default SettingsForm;