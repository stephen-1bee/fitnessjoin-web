import { SettingOutlined } from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Switch } from "antd"
import React from "react"

const FitnessSettings = () => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`)
  }

  

  return (
    <div>
      <div className="flex gap-2 items-center">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <SettingOutlined className="text-white text-lg" />
        </div>
        <h1 className="text-2xl">Settings</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Settings
      </p>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Opened</h1>
        <Switch defaultChecked onChange={onChange} />
      </div>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Allow Resgistration</h1>
        <Switch defaultChecked onChange={onChange} />
      </div>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Notifications</h1>
        <Switch defaultChecked onChange={onChange} />
      </div>
    </div>
  )
}

export default FitnessSettings
