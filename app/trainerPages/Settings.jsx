import React from "react";
import { Switch } from "antd";

const Settings = () => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };
  return (
    <div>
      <h1 className="text-2xl"> Settings</h1>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Notifications</h1>
        <Switch defaultChecked onChange={onChange} />
      </div>
    </div>
  );
};

export default Settings;
