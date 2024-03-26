import { SettingOutlined } from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Switch } from "antd"
import React, { useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"

const FitnessSettings = () => {
  const [admin, setAdmin] = useState([])
  const [isOpened, setIsOpened] = useState(false)
  const [isNotificationOpened, setIsNotificaitionOpened] = useState(false)

  let centerId
  let notification
  // retrieve admin id
  if (typeof sessionStorage !== "undefined") {
    centerId = sessionStorage.getItem("fitnessCenterId")
  }

  // get current fitness center
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

  const onChangeOpen = async (checked) => {
    const endpoint = checked
      ? `http://localhost:1000/api/v1/admins/open/${centerId}`
      : `http://localhost:1000/api/v1/admins/close/${centerId}`

    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      const response = await fetch(endpoint, requestOptions)
      const result = await response.json()

      if (response.ok) {
        const successMessage = checked
          ? "Profile opened successfully"
          : "Profile closed successfully"
        toast.success(successMessage)
        setIsOpened(checked)
      } else {
        toast.error(result.error || "Failed to toggle profile")
      }
    } catch (error) {
      console.error("Error toggling profile:", error)
      toast.error("An error occurred while toggling profile")
    }
  }

  const onChangeNotificiton = async (checked) => {
    const endpoint = checked
      ? `http://localhost:1000/api/v1/admins/notification/on/${centerId}`
      : `http://localhost:1000/api/v1/admins/notification/off/${centerId}`

    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      const response = await fetch(endpoint, requestOptions)
      const result = await response.json()

      if (response.ok) {
        const successMessage = checked
          ? "Notification has been turned on"
          : "Notification has been turned off"
        toast.success(successMessage)
        setIsNotificaitionOpened(checked)
      } else {
        toast.error(result.error || "Failed to toggle notificaion")
      }
    } catch (error) {
      console.error("Error toggling profile:", error)
      toast.error("An error occurred while toggling notificaion")
    }
  }

  useEffect(() => {
    getFitnessCenter()
  }, [])

  return (
    <div>
      <div className="flex gap-2 items-center">
        {}
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
            <h1 className="text-xl">Open Registration</h1>
            <Switch defaultChecked={isOpened} onChange={onChangeOpen} />
          </div>
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Notifications</h1>
            <Switch
              defaultChecked={isNotificationOpened}
              onChange={onChangeNotificiton}
            />
          </div>
        </div>
      ))}
      <Toaster />
    </div>
  )
}

export default FitnessSettings
