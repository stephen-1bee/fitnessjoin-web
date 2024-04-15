"use client"
import { FrownOutlined } from "@ant-design/icons"
import { Try } from "@mui/icons-material"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { SettingsOutlined } from "@mui/icons-material"

const Notification = () => {
  // State for storing notifications
  const [notification, setNotifications] = useState([])
  const [trainer, setTrainer] = useState({})
  const [trainerNotification, settrainerNotification] = useState([])

  let trainer_center_id
  let trainer_id
  let notificationStatus
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
    notificationStatus = sessionStorage.getItem("tNotification")
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

  // get trainer notifications
  const getTrainerNotification = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/activities/trainer/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerNotification(result.activity)
          console.log("trainer activity", result.activity)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
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
    getTrainerNotification()
  }, [])

  return (
    <div className="w-[400px] shadow-md py-5 flex flex-col bg-[#fdf9f0] px-5 rounded-lg">
      {notification.length > 0 ? (
        <div className="py-2">
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
              <div className="flex flex-col gap-5">
                {trainerNotification.map((notification) => (
                  <div className="flex gap-1 items-center">
                    <div className=" w-2 h-2 bg-blue-600 rounded-full mr-2" />
                    {/* <Image
                      src={`http://localhost:1000/${notification.center[0]?.photo}`}
                      height={100}
                      width={100}
                      alt="image"
                      className="rounded-full h-[50px] w-[50px] object-cover"
                    /> */}
                    <div className="flex flex-col">
                      {/* <h1 className="font-bold text-[17px]">
                        {notification.center[0]?.name}{" "}
                      </h1> */}
                      <p>{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
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
    // <div>
    //   <div className="w-[250px] shadow-md py-5 flex items-center bg-[#fdf9f0]  justify-center rounded-lg">
    //     {notification.length > 0 ? (
    //       <div className="px-5">
    //         {notificationStatus === "true" ? (
    //           <div>
    //             {notification.map((notice) => (
    //               <div>
    //                 <h1>From: {notice.center[0]?.name} </h1>
    //                 <div className="flex gap-2 items-center ">
    //                   <div className=" w-2 h-2 bg-blue-600 rounded-full " />
    //                   <p>{notice.message}</p>
    //                 </div>
    //               </div>
    //             ))}
    //             <div>
    //               {trainerNotification.map((notification) => (
    //                 <div className="flex gap-2 items-center ">
    //                   <div className="w-2 h-2 bg-blue-600 rounded-full " />
    //                   <p>{notification.message}</p>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         ) : (
    //           <div className="flex flex-col items-center justify-center m-auto gap-2">
    //             <FrownOutlined />
    //             <p>Notifications has been turned off</p>
    //           </div>
    //         )}
    //       </div>
    //     ) : (
    //       <div className="flex flex-col items-center gap-3 mt-5">
    //         <FrownOutlined />
    //         <p>No Notifications yet</p>
    //       </div>
    //     )}
    //   </div>
    // </div>
  )
}

export default Notification
