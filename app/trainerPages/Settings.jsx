import React, { useState, useEffect } from "react"
import { Switch } from "antd"
import toast, { Toaster } from "react-hot-toast"
import { Drawer, Popconfirm } from "antd"

const Settings = () => {
  const [trainer, setTrainer] = useState({})

  let notificationStatus
  let trainer_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    notificationStatus = sessionStorage.getItem("notification")
  }

  const [isNotificationOpened, setIsNotificationOpened] =
    useState(notificationStatus)

  // get current trainer
  const getTrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      const response = await fetch(
        `http://localhost:1000/api/v1/trainers/one/${trainer_id}`,
        requestOptions
      )
      const result = await response.json()
      sessionStorage.setItem("notification", result.trainer[0].isNotification)
      setTrainer(result.trainer[0])
      setIsNotificationOpened(result.trainer[0].isNotification)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTrainer()
  }, [])

  const handleOpenNotification = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/notification/on/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned on") {
            toast.success("Notifications enabled")
            console.log(result)
            getTrainer()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleCloseNotification = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/notification/off/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned off") {
            toast.success(result.msg)
            getTrainer()
            console.log(result)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl"> Settings</h1>

      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Notifications</h1>
        <div>
          {notificationStatus === "true" ? (
            <div className="flex gap-5">
              <p className="bg-[#08a88a] text-white p-3 rounded-full px-5">
                Enabled
              </p>
              <Popconfirm
                description="Do you want to disable notifications?"
                okText="Disable"
                okButtonProps={{
                  style: {
                    backgroundColor: "#c83a3a",
                    color: "white",
                  },
                }}
                onConfirm={() => handleCloseNotification()}
              >
                <button>Disable</button>
              </Popconfirm>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <p className="bg-[#c83a3a] text-white p-3 rounded-full px-5">
                Disabled
              </p>
              <Popconfirm
                description="Do you want to enable notifications?"
                okText="Enable"
                okButtonProps={{
                  style: { backgroundColor: "#08a88a", color: "white" },
                }}
                onConfirm={() => handleOpenNotification()}
              >
                <button>Enable</button>
              </Popconfirm>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default Settings
