import React, { useState, useEffect } from "react"
import { Switch } from "antd"
import toast, { Toaster } from "react-hot-toast"

const Settings = () => {
  const [user, setUser] = useState({})
  let user_id
  if (typeof sessionStorage !== "undefined") {
    user_id = sessionStorage.getItem("userId")
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
      setUser(result.trainer[0])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleToggle = (isNotification) => {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = isNotification
      ? `http://localhost:1000/api/v1/users/notification/on/${user_id}`
      : `http://localhost:1000/api/v1/users/notification/off/${user_id}`

    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "notification has been turned on") {
          toast.success("Notification has been turned on")
          setUser({ ...user, isNotification: true })
        } else if (result.msg === "notification has been turned off") {
          toast.success("Notification has been turned off")
          setUser({ ...user, isNotification: false })
        } else {
          toast.error(result.msg)
        }
      })
      .catch((error) => console.error(error))
  }

  const onChange = (checked) => {
    console.log(`Switch to ${checked}`)
    handleToggle(checked)
  }

  const notification = user.isNotification

  return (
    <div>
      <h1 className="text-2xl"> Settings</h1>
      <div className="mt-10 flex gap-8 items-center">
        <h1 className="text-xl">Notifications</h1>
        <Switch defaultChecked={notification} onChange={onChange} />
      </div>
      <Toaster />
    </div>
  )
}

export default Settings
