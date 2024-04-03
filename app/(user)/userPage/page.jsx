"use client"
import Session from "@/app/userPages/Session"
import {
  AppstoreOutlined,
  BankOutlined,
  LogoutOutlined,
  MenuOutlined,
  PaperClipOutlined,
  SettingOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { FrownOutlined } from "@ant-design/icons"
import {
  ArticleSharp,
  CardTravelOutlined,
  FoodBankOutlined,
  KeyboardArrowDownOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  SportsGymnasticsOutlined,
} from "@mui/icons-material"
import { MenuItem } from "@mui/material"
import { Dropdown, Modal, Popconfirm, Rate } from "antd"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import Dashboard from "@/app/userPages/Dashboard"
import Center from "@/app/userPages/Center"
import Nutrition from "@/app/userPages/Nutrition"
import Membership from "@/app/userPages/Membership"
import Articles from "@/app/userPages/Articles"
import Setting from "@/app/userPages/Setting"
import Profile from "@/app/userPages/Profile"
import Notification from "@/app/userPages/Notification"
import { FloatButton } from "antd"
import toast, { Toaster } from "react-hot-toast"
import { Result } from "antd"

const page = () => {
  const [myState, setMyState] = useState("hidden")
  const [activeModule, setActiveModule] = useState("")
  const [user, setUser] = useState([])
  const [notification, setnotification] = useState([])
  const [message, setmessage] = useState("")
  const [openRatingModal, setopenRatingModal] = useState(false)
  const [success, setSuccess] = useState(false)

  const [value, setValue] = useState(3)

  const desc = ["terrible", "bad", "normal", "good", "wonderful"]

  // retrieving user id
  let userId
  let user_center_id
  if (typeof sessionStorage !== "undefined") {
    userId = sessionStorage.getItem("userId")
    user_center_id = sessionStorage.getItem("userCenterId")
  }

  // get a user
  const getUser = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setUser(result.user)
          console.log(result.user)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleCenterNotification = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/notifications/center/${user_center_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setnotification(result.center_notification)
          console.log(result.center_notification)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // init
  useEffect(() => {
    getUser()
    handleCenterNotification()
  }, [])

  // notification ui
  const notificationUi = () => (
    <div className="w-[250px] shadow-md py-5 flex items-center bg-[#fdf9f0]  justify-center rounded-lg">
      {notification.length > 0 ? (
        <div>
          {notification.map((notice) => (
            <div className="flex flex-col mt-2">
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
        <div className="flex flex-col items-center gap-3 mt-5">
          <FrownOutlined />
          <p>No Notifications yet</p>
        </div>
      )}
    </div>
  )

  // menu items
  const MyMenu = () => (
    <div className="bg-white p-2 shadow-2xl rounded-xl">
      <MenuItem onClick={() => setActiveModule("profile")} className="gap-2">
        {" "}
        <UserOutlined /> Profile
      </MenuItem>
      <MenuItem
        onClick={() => setActiveModule("notification")}
        className="gap-2"
      >
        {" "}
        <NotificationsOutlined /> Notification
      </MenuItem>
      <MenuItem onClick={() => setActiveModule("settings")} className="gap-2">
        <SettingsOutlined /> Settings
      </MenuItem>
      <Popconfirm
        description="Do you want to logout?"
        onConfirm={() => logout()}
        okText="Yes"
        okButtonProps={{
          style: { backgroundColor: "#c83a3a", color: "white" },
        }}
      >
        <MenuItem className="gap-2">
          <LogoutOutlined /> Logout
        </MenuItem>
      </Popconfirm>
    </div>
  )

  const logout = () => {
    location.href = "/userLogin"
  }

  const sendFeedback = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      const raw = JSON.stringify({
        center_id: user_center_id,
        trainer_id: null,
        message: message,
        user_id: userId,
        creator_type: "user",
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
            setopenRatingModal(true)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleRating = () => {
    setSuccess(true)
  }

  const sendMessageUi = () => (
    <div className="w-[300px] h-[350px] shadow-md py-5 flex items-center bg-white flex-col rounded-lg gap-3">
      <h1 className="text-xl font-semibold">Inform us about anything</h1>
      <textarea
        type="text"
        onChange={(e) => setmessage(e.target.value)}
        placeholder="tell us something about your experiences"
        rows={7}
        className="rounded-md py-3 px-3 w-[250px] ring-1 ring-[#ccc] mt-5 outline-black"
      />
      <button onClick={() => setopenRatingModal(true)}>open</button>
      <button
        onClick={() => sendFeedback()}
        className="w-[250px] rounded-full bg-[#08A88A] py-3 text-white "
      >
        Send
      </button>
    </div>
  )

  // dynamic pages
  const dynamicPages = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />
      case "sessions":
        return <Session />
      case "center":
        return <Center />
      case "nutrition":
        return <Nutrition />
      case "membership":
        return <Membership />
      case "Articles":
        return <Articles />
      case "settings":
        return <Setting />
      case "profile":
        return <Profile />
      case "notification":
        return <Notification />
      default:
        return <Dashboard />
    }
  }

  const successUi = () => (
    <div>
      {success && (
        <div className="z-[999]">
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={<button onClick={() => setSuccess(false)}> Continue</button>}
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex bg-[#fdfaf3]">
      {/* Sidenav */}
      <div className="flex-[0.2.4] shadow bg-[#fdfaf3] p-5 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <Image width={50} height={50} alt="logo" src="/logo.png" />
          <div className="flex flex-col items-center  mt-2">
            <p className="text-lg">
              Fitness<span className="font-black text-[#08A88A]">Join</span>
            </p>
            <h1>Client</h1>
          </div>
        </div>

        {/* Main Sidebar Elements */}
        <div className="flex flex-col gap-3 p-5">
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("dashboard")}
          >
            <AppstoreOutlined />
            <p>Dashboard</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("sessions")}
          >
            <SportsGymnasticsOutlined />
            <p>Sessions</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("center")}
          >
            <BankOutlined />
            <p>View Center</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("nutrition")}
          >
            <FoodBankOutlined />
            <p>Nutrition</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("membership")}
          >
            <CardTravelOutlined />
            <p>Membership</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("Articles")}
          >
            <PaperClipOutlined />
            <p>Articles</p>
          </div>

          {/*  */}
          <div className="pl-6 absolute bottom-8 flex flex-col items-center justify-center">
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
              onClick={() => setActiveModule("settings")}
            >
              <SettingOutlined />
              <p>Settings</p>
            </div>

            <Popconfirm
              description="Do you want to logout?"
              onConfirm={() => logout()}
              okText="Yes"
              okButtonProps={{
                style: { backgroundColor: "#c83a3a", color: "white" },
              }}
            >
              <div className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full ">
                <LogoutOutlined />
                <p>Logout</p>
              </div>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="md:flex-[0.8] flex-1">
        {/* Top Nav */}
        <div className="h-[7rem] bg-[#fdfaf3] w-full flex items-center justify-between px-8">
          <div>
            <MenuOutlined
              className="boder border-[#ccc] border-2 p-1 rounded cursor-pointer md:hidden block"
              onClick={() => setMyState("block")}
            />
          </div>
          <div className="flex items-center gap-3">
            <Dropdown
              overlay={notificationUi}
              trigger={["click"]}
              className="cursor-pointer lg:flex hidden"
            >
              <NotificationsOutlined />
            </Dropdown>
            <p>
              Hello {user ? user[0]?.first_name : null}{" "}
              {user ? user[0]?.last_name : null}
            </p>
            <Dropdown
              overlay={MyMenu}
              trigger={["click"]}
              className="cursor-pointer"
            >
              <KeyboardArrowDownOutlined />
            </Dropdown>
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
        </div>

        <div className="w-full h-full p-9 bg-[#f0f0f0]">
          <h1>{dynamicPages()}</h1>
        </div>
      </div>

      {success && (
        <div className="">
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={<button onClick={() => setSuccess(false)}> Continue</button>}
          />
        </div>
      )}

      {/* Mobile Nav */}
      <div
        className={`w-full h-full bg-[#fdfaf3] absolute z-[999] p-5 pt-7 ${myState}`}
      >
        <div className="flex flex-col gap-3">
          <p
            className="pl-6 cursor-pointer"
            onClick={() => setMyState("hidden")}
          >
            X
          </p>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("dashboard")}
          >
            <AppstoreOutlined />
            <p>Dashboard</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("sessions")}
          >
            <SportsGymnasticsOutlined />
            <p>Sessions</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("center")}
          >
            <BankOutlined />
            <p>View Center</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("nutrition")}
          >
            <FoodBankOutlined />
            <p>Nutrition</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("membership")}
          >
            <CardTravelOutlined />
            <p>Membership</p>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
            onClick={() => setActiveModule("Articles")}
          >
            <ArticleSharp />
            <p>Articles</p>
          </div>

          {/* bottom */}
          <div className="pl-6 absolute bottom-8 flex flex-col items-center justify-center">
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full pl-6"
              onClick={() => setActiveModule("settings")}
            >
              <SettingOutlined />
              <p>Settings</p>
            </div>
            <Popconfirm
              description="Do you want to logout"
              okText="Yes"
              onCancel="No"
              onConfirm={() => logout()}
              okButtonProps={{
                style: { backgroundColor: "#c83a3a", color: "white" },
              }}
              className=""
            >
              <div className="flex items-center gap-4 cursor-pointer hover:bg-[#f9fafd] p-3 rounded-full ">
                <LogoutOutlined />
                <p>Logout</p>
              </div>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* rating modal */}
      <Modal
        open={openRatingModal}
        footer={[false]}
        centered
        onCancel={() => setopenRatingModal(false)}
      >
        <div className="item-center justify-center flex flex-col m-auto gap-3">
          <h1 className="text-2xl">Help us improve by rating us</h1>
          <Rate tooltips={desc} onChange={setValue} value={value} />
          {value ? <span>{desc[value - 1]}</span> : null}
          <button
            onClick={() => handleRating()}
            className="px-4 py-4 bg-[#08A88A] rounded-full text-white"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default page
