"use client"
import { FrownOutlined } from "@ant-design/icons"
import React, { useState, useEffect } from "react"

const Notification = () => {
  // State for storing notifications
  const [notification, setNotifications] = useState([])
  const [trainer, setTrainer] = useState({})

  let trainer_center_id
  let trainer_id
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
  }

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
      setTrainer(result.trainer[0])
    } catch (error) {
      console.error(error)
    }
  }

  const getNotificaiton = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      const response = await fetch(
        `http://localhost:1000/api/v1/notifications/center/${trainer_center_id}`,
        requestOptions
      )

      if (response.ok) {
        const result = await response.json()
        setNotifications(result.center_notification)
        console.log(result.center_notification)
      } else {
        throw new Error("Failed to fetch notifications")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Init notification fetching
  useEffect(() => {
    getTrainer()
    getNotificaiton()
  }, [])

  return (
    <div>
      <div className="w-[250px] shadow-md py-6 flex items-center bg-[#fdf9f0] justify-center rounded-lg">
        {notification.length > 0 ? (
          <div className="flex flex-col gap-5">
            {notification.map((notice) => (
              <div>
                <h1>From: {notice.center[0]?.name} </h1>
                <div className="flex gap-2 items-center ">
                  <div className=" w-2 h-2 bg-blue-600 rounded-full " />
                  <p>{notice.message}</p>
                </div>
                <div className="border-b mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 mt-3">
            <FrownOutlined />
            <p>No Notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
