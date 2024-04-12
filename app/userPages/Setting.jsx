import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Popconfirm } from "antd"

const Settings = () => {
  const [user, setUser] = useState({})
  const [notification, setnotification] = useState()
  let user_id
  let notificationStatus
  if (typeof sessionStorage !== "undefined") {
    user_id = sessionStorage.getItem("userId")
    notificationStatus = sessionStorage.getItem("userNotification")
  }

  // get current user
  const getUser = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      const response = await fetch(
        `http://localhost:1000/api/v1/users/one/${user_id}`,
        requestOptions
      )
      const result = await response.json()
      sessionStorage.setItem("userNotification", result.user[0].isNotification)
      setUser(result.user[0])
      setnotification(result.user[0].isNotification)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleOpenNotification = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/notification/on/${user_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned on") {
            toast.success("Notifications enabled")
            console.log(result)
            getUser()
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
        `http://localhost:1000/api/v1/users/notification/off/${user_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned off") {
            toast.success(result.msg)
            getUser()
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
      <h1 className="text-2xl">Settings</h1>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Notifications</h1>
        <div>
          {notificationStatus === "true" ? (
            <div className="flex gap-5">
              <p className="bg-[#08a88a] text-white p-3 px-5 rounded-full ">
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
                <button className="border border-[#ccc] px-5 py-3 rounded-full border-dotted">
                  Disable
                </button>
              </Popconfirm>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <p className="bg-[#c83a3a] text-white p-3 rounded-full px-4">
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
                <button className="border border-[#ccc] px-5 py-3 rounded-full border-dotted">
                  Enable
                </button>
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
