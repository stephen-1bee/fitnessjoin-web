import React, { useState, useEffect } from "react"
import { SettingOutlined } from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Switch } from "antd"
import { toast, Toaster } from "react-hot-toast"

const FitnessSettings = () => {
  // State variables
  const [admin, setAdmin] = useState([])
  const [isOpened, setIsOpened] = useState(false)
  const [isNotificationOpened, setIsNotificationOpened] = useState(false)

  // Retrieve admin ID from session storage
  const centerId = sessionStorage.getItem("fitnessCenterId")

  // Function to fetch fitness center data
  const fetchFitnessCenter = async () => {
    try {
      const response = await fetch(
        `http://localhost:1000/api/v1/admins/one/${centerId}`
      )
      const result = await response.json()

      // Set admin state and open status
      setAdmin(result.admin)
      setIsOpened(result.admin.isOpened)
    } catch (error) {
      console.error("Error fetching fitness center data:", error)
    }
  }

  // Function to handle toggling open status
  const toggleOpenStatus = async (checked) => {
    const endpoint = `http://localhost:1000/api/v1/admins/${
      checked ? "open" : "close"
    }/${centerId}`

    try {
      const response = await fetch(endpoint, { method: "PUT" })
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

  // Function to handle toggling notification status
  const toggleNotificationStatus = async (checked) => {
    const endpoint = `http://localhost:1000/api/v1/admins/notification/${
      checked ? "off" : "on"
    }/${centerId}`

    try {
      const response = await fetch(endpoint, { method: "PUT" })
      const result = await response.json()

      if (response.ok) {
        const successMessage = checked
          ? "Notification has been turned on"
          : "Notification has been turned off"
        toast.success(successMessage)
        setIsNotificationOpened(checked)
      } else {
        toast.error(result.error || "Failed to toggle notification")
      }
    } catch (error) {
      console.error("Error toggling notification:", error)
      toast.error("An error occurred while toggling notification")
    }
  }

  // Fetch fitness center data on component mount
  useEffect(() => {
    fetchFitnessCenter()
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
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Open Registration</h1>
            <Switch defaultChecked={isOpened} onChange={toggleOpenStatus} />
          </div>
          <div className="mt-10 flex gap-8 items-center">
            <h1 className="text-xl">Notifications</h1>
            <Switch
              defaultChecked={isNotificationOpened}
              onChange={toggleNotificationStatus}
            />
          </div>
        </div>
      ))}
      <Toaster />
    </div>
  )
}

export default FitnessSettings
