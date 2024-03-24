import { SettingOutlined } from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Switch } from "antd"
import React, { useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"

const FitnessSettings = () => {
  const [admin, setAdmin] = useState([])
  const [isOpened, setIsOpened] = useState(false) // State to manage isOpened switch

  let centerId
  // retrieve admin id
  if (typeof sessionStorage !== "undefined") {
    centerId = sessionStorage.getItem("fitnessCenterId")
  }

  const getFitnessCenter = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      const response = await fetch(
        `http://localhost:1000/api/v1/admins/one/${centerId}`,
        requestOptions
      )
      const result = await response.json()
      setAdmin(result.admin)
      setIsOpened(result.admin.isOpened)
      console.log(result.admin)
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = (checked) => {
    // Modified onChange function to handle switch state
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = checked
      ? `http://localhost:1000/api/v1/admins/open/${centerId}`
      : `http://localhost:1000/api/v1/admins/close/${centerId}`

    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "Profile opended successfully") {
          toast.success(result.msg)
          console.log(`switch to ${checked}`)
          console.log(result)
        } else {
          toast.success("Profile closed successfully")
        }
      })
      .catch((error) => console.error(error))

    setIsOpened(checked) // Update the isOpened state
  }

  useEffect(() => {
    getFitnessCenter()
  }, [])

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
      {admin.map((ad) => (
        <div key={ad.id}>
          {" "}
          {/* Added key prop */}
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Opened</h1>
            <Switch defaultChecked={isOpened} onChange={onChange} />
          </div>
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Allow Registration</h1>{" "}
            {/* Corrected typo */}
            <Switch
              defaultChecked={ad.allowRegistration}
              onChange={(checked) =>
                handleAllowRegistrationChange(checked, ad.id)
              }
            />{" "}
            {/* Assume ad.allowRegistration represents the corresponding state */}
          </div>
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Notifications</h1>
            <Switch
              defaultChecked={ad.notifications}
              onChange={(checked) => handleNotificationsChange(checked, ad.id)}
            />{" "}
            {/* Assume ad.notifications represents the corresponding state */}
          </div>
        </div>
      ))}
      <Toaster />
    </div>
  )
}

export default FitnessSettings
