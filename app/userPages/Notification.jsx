"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { FrownOutlined } from "@ant-design/icons"

const Notification = () => {
  const [notification, setNotifications] = useState([])

  let user_center_id
  let notificationStatus
  if (typeof sessionStorage !== "undefined") {
    user_center_id = sessionStorage.getItem("userCenterId")
    notificationStatus = sessionStorage.getItem("userNotification")
  }

  // State for storing notifications
  const getNotificaiton = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      const response = await fetch(
        `http://localhost:1000/api/v1/notifications/center/${user_center_id}`,
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
    getNotificaiton()
  }, [])

  return (
    <div>
      <div className="w-[390px] shadow-md py-5 flex items-center bg-[#fdf9f0] px-5 rounded-lg">
        {notification.length > 0 ? (
          <div>
            {notificationStatus === "true" ? (
              <div className="flex flex-col gap-5">
                {notification.map((notice) => (
                  <div className="flex gap-2 items-center">
                    <div className=" w-2 h-2 bg-blue-600 rounded-full " />
                    <Image
                      src={`http://localhost:1000/${notice.center[0]?.photo}`}
                      height={100}
                      width={100}
                      alt="image"
                      className="rounded-full h-[50px] w-[50px] object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-bold text-[17px]">
                        {notice.center[0]?.name}{" "}
                      </h1>
                      <p>{notice.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center m-auto gap-2">
                <FrownOutlined />
                <p>Notifications has been turned off</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 mt-5">
            <FrownOutlined />
            <p>No Notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
