"use client"
import Dashboard from "@/app/trainerPages/Dashboard"
import Session from "@/app/trainerPages/Session"
import {
  AppstoreOutlined,
  BankOutlined,
  CaretDownFilled,
  MenuOutlined,
  LogoutOutlined,
  FrownOutlined,
  PaperClipOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import {
  ArticleOutlined,
  CardTravelOutlined,
  FoodBankOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  SportsGymnasticsOutlined,
} from "@mui/icons-material"
import { MenuItem } from "@mui/material"
import { Dropdown, Popconfirm } from "antd"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import Nutrition from "@/app/trainerPages/Nutrition"
import TrainerCenter from "@/app/trainerPages/TrainerCenter"
import Users from "@/app/trainerPages/Users"
import Membership from "@/app/trainerPages/Membership"
import Articles from "@/app/trainerPages/Articles"
import Settings from "@/app/trainerPages/Settings"
import Profile from "@/app/trainerPages/Profile"
import Notification from "@/app/trainerPages/Notification"
import { FloatButton } from "antd"
import toast, { Toaster } from "react-hot-toast"

const page = () => {
  const [activePage, setActivePage] = useState("")
  const [trainer, settrainer] = useState([])
  const [notification, setnotification] = useState([])
  const [message, setmessage] = useState("")

  console.log(message)
  let trainerName
  let trainer_center_id
  let trainer_id
  let notificaitonStatus
  if (typeof sessionStorage !== "undefined") {
    trainerName = sessionStorage.getItem("trainerName")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
    notificaitonStatus = sessionStorage.getItem("notification")
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
        setnotification(result.center_notification)
        console.log(result.center_notification)
      } else {
        throw new Error("Failed to fetch notifications")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const notificationUi = () => (
    <div className="w-[250px] shadow-md py-5 flex items-center bg-[#fdf9f0]  justify-center rounded-lg">
      {notification.length > 0 ? (
        <div>
          {notificaitonStatus === "true" ? (
            <div>
              {notification.map((notice) => (
                <div>
                  <h1>From: {notice.center[0]?.name} </h1>
                  <div className="flex gap-2 items-center ">
                    <div className=" w-2 h-2 bg-blue-600 rounded-full " />
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
  )

  const sendFeedback = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        center_id: trainer_center_id,
        trainer_id: trainer_id,
        message: message,
        user_id: null,
        creator_type: "trainer",
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/feedbacks/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "message sent successfully") {
            toast.success(result.msg)
            console.log(result.msg)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const sendMessageUi = () => (
    <div className="w-[330px] h-[350px] shadow-md py-5 flex items-center bg-white flex-col rounded-lg gap-2">
      <h1 className="text-xl font-semibold">Inform us about anything</h1>
      <textarea
        type="text"
        onChange={(e) => setmessage(e.target.value)}
        placeholder="tell us something about your experiences"
        rows={7}
        className="rounded-md py-3 px-3 w-[250px] ring-1 ring-[#ccc] mt-5 outline-black"
      />
      <button
        onClick={() => sendFeedback()}
        className="w-[250px] rounded-full bg-[#08A88A] py-3 text-white "
      >
        Send
      </button>
    </div>
  )

  useEffect(() => {
    getNotificaiton()
  }, [])

  const MyMenu = () => (
    <div className="bg-white p-2 shadow-2xl rounded-xl">
      <MenuItem
        className="rounded gap-2"
        onClick={() => setActivePage("profile")}
      >
        <UserOutlined /> Profile
      </MenuItem>

      <MenuItem onClick={() => setActivePage("notification")} className="gap-2">
        {" "}
        <NotificationsOutlined /> Notification
      </MenuItem>
      <MenuItem
        className="rounded gap-2"
        onClick={() => setActivePage("setting")}
      >
        <SettingsOutlined />
        Settings
      </MenuItem>
      <Popconfirm
        description="Wanna logout?"
        onConfirm={() => logout()}
        okText="Logout"
        okButtonProps={{
          style: { backgroundColor: "#c83a3a", color: "white" },
        }}
      >
        <MenuItem className="gap-2">
          {" "}
          <MenuItem className="gap-2">
            <LogoutOutlined /> Logout
          </MenuItem>
        </MenuItem>
      </Popconfirm>
    </div>
  )

  const renderedPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />
      case "session":
        return <Session />
      case "center":
        return <TrainerCenter />
      case "nutrition":
        return <Nutrition />
      case "articles":
        return <Articles />
      case "membership":
        return <Membership />
      case "users":
        return <Users />
      case "setting":
        return <Settings />
      case "profile":
        return <Profile />
      case "notification":
        return <Notification />
      default:
        return <Dashboard />
    }
  }

  const logout = () => {
    location.href = "/trainerLogin"
  }

  return (
    <div className="min-h-screen flex bg-[#f9fafd]">
      {/* side nav */}
      <div className="flex-[0.2.7] shadow bg-[#fdfaf3] p-9 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <Image width={50} height={50} alt="logo" src="/logo.png" />
          <div className="flex flex-col items-center mt-2">
            <p className="text-lg">
              Fitness<span className="font-black text-[#08A88A]">Join</span>
            </p>
            <h1>Trainer</h1>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("dashboard")}
          >
            <AppstoreOutlined />
            <p>Dashboard</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("users")}
          >
            <UserSwitchOutlined />
            <p>Users</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("session")}
          >
            <SportsGymnasticsOutlined />
            <p>Sessions</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("center")}
          >
            <BankOutlined />
            <p>View Center</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("nutrition")}
          >
            <FoodBankOutlined />
            <p>Nutrition</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("membership")}
          >
            <CardTravelOutlined />
            <p>Membership</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActivePage("articles")}
          >
            <ArticleOutlined />
            <p>Articles</p>
          </div>

          {/* others */}
          <div className="pl-6 absolute  bottom-8 flex flex-col items-center jsutify-center">
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
              onClick={() => setActivePage("setting")}
            >
              <SettingOutlined />
              <p>Settings</p>
            </div>
            <Popconfirm
              description="Wanna logout"
              okText="Logout"
              onConfirm={() => logout()}
              okButtonProps={{
                style: { backgroundColor: "#c83a3a", color: "white" },
              }}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full "
            >
              <LogoutOutlined />
              <p>Logout</p>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* nav */}
      <div className="flex-1 ">
        <div className="flex items-center justify-between bg-[#fdfaf3] h-[7rem] flex-1 px-8">
          <h1></h1>
          <div className="md:hidden flex">
            <MenuOutlined className="boder border-[#ccc] border-2 p-1 rounded cursor-pointer" />
          </div>
          <div className="flex items-center gap-4">
            <h1 className="items-ceter justify-end">Welcome, {trainerName}</h1>

            <Dropdown
              overlay={MyMenu}
              trigger={["click"]}
              className="cursor-pointer"
            >
              <CaretDownFilled />
            </Dropdown>
            <Dropdown
              overlay={notificationUi}
              placement="bottomRight"
              trigger={["hover"]}
              className="cursor-pointer"
            >
              <NotificationsOutlined />
            </Dropdown>
          </div>
        </div>

        <Dropdown
          overlay={sendMessageUi}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <FloatButton
            icon={<MessageOutlined />}
            onClick={() => console.log("onClick")}
          />
        </Dropdown>
        {/* dynamic rendering */}
        <div className="p-10 bg-[#f0f0f0] min-h-screen">{renderedPage()}</div>
      </div>
      <Toaster />
    </div>
  )
}

export default page
