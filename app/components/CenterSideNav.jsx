"use client"
import {
  BroadcastOnPersonal,
  CardMembership,
  CategoryOutlined,
  ChatBubbleOutline,
  FitnessCenterOutlined,
  FoodBankOutlined,
  Person2Outlined,
} from "@mui/icons-material"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  HomeOutlined,
  SettingOutlined,
  FrownOutlined,
} from "@ant-design/icons"
import { Avatar, Dropdown, message, Popconfirm, Space } from "antd"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import { UserOutlined } from "@ant-design/icons"

const centerSideNav = ({ setActiveItem, activeItem }) => {
  const [notification, setNotification] = useState([])

  useEffect(() => {
    const storedActiveItem = sessionStorage.getItem("activeItem")
    if (storedActiveItem) {
      setActiveItem(storedActiveItem)
    }
  }, [setActiveItem])

  const handleItemClick = (item) => {
    setActiveItem(item)
    sessionStorage.setItem("activeItem", item)
  }

  const confirm = (e) => {
    console.log(e)
    if (confirm) {
      message.success("Logout successful")
      location.href = "/adminLogin"
    }
  }
  const cancel = (e) => {}
  let center_id
  let name

  if (typeof sessionStorage !== "undefined") {
    name = sessionStorage.getItem("centerName")
    center_id = sessionStorage.getItem("fitnessCenterId")
  }

  const getNotification = async (req, res) => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      }

      let response = await fetch(
        `http://localhost:1000/api/v1/activities/center/${center_id}`,
        {
          method: "GET",
          headers: headersList,
        }
      )

      let data = await response.json()
      setNotification(data.activity)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  const [admin, setadmin] = useState([])
  const handleAdmin = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `https://fitness-join-api-xe62.onrender.com/api/v1/admins/one/${cemter_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setadmin(result.admin)
          console.log(result.admin)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleAdmin()
    getNotification()
  }, [])

  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"]
  const user = [
    {
      key: "1",
      label: (
        <Popconfirm
          placement="top"
          title={"Logout"}
          description={"Do you want logout?"}
          okText="Yes"
          okButtonProps={{ style: { backgroundColor: "red" } }}
          onConfirm={() => (window.location.href = "/adminLogin")}
          cancelText="No"
        >
          <button>Logout</button>
        </Popconfirm>
      ),
    },
  ]

  const item1 = (
    <div>
      <div className="w-[250px] shadow-md py-6 flex items-center bg-[#fdf9f0] justify-center rounded-lg">
        {notification.length > 0 ? (
          <div className="flex flex-col gap-5 px-5">
            {notification.map((notice) => (
              <div>
                {/* <h1>From: {notice.center.name} </h1> */}
                <div className="flex gap-2 items-center ">
                  <div className=" w-[5px] h-[5px] bg-blue-600 rounded-full " />
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
    </div>
  )

  return (
    <div>
      {/* <div className="absolute right-10 items-center justify-center top-6 flex gap-3 ">
        <div className="items-center justify-center flex gap-2">
          <p>{name ? name : null}</p>
        </div>
        <Dropdown
          overlay={item1}
          trigger={["click"]}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <NotificationsNoneIcon />
        </Dropdown>
        <Dropdown
          menu={{ items: user }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
        >
          <Avatar
            className="items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#7265e6" }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div> */}
      <div className="min-h-screen flex flex-col justify-between fixed h-full">
        <div className="flex flex-col items-center justify-center">
          {/* <div>
            <Image
              className="ml-11 mt-4"
              width={30}
              height={30}
              alt="logo"
              src="/logo.png"
              priority
            />
          </div> */}

          {/* sideNav */}
          <div className="flex flex-col px-11 mt-5 ">
            <div className="flex flex-col py-5 gap-2 w-[fit]">
              <button
                onClick={() => handleItemClick("FitnessDashboard")}
                className={` hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform delay-750 ease-in-out transition-all  hover:translate-x-2 ${
                  activeItem === "FitnessDashboard" ? "active" : ""
                }`}
              >
                <HomeOutlined className="text-[18px]" />
                <p className="text-[16px]">Dashboard</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessMembers")}
                className={` hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessMembers" ? "active" : ""
                }`}
              >
                <Person2Outlined className="text-[18px]" />
                <p className="text-[16px]">Members</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessTrainers")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessTrainers" ? " active" : ""
                }`}
              >
                <FitnessCenterOutlined className="text-[18px]" />
                <p className="text-[16px]">Tainers</p>
              </button>
              <button
                onClick={() => handleItemClick("FitnessMemberships")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessMemberships" ? "active" : ""
                }`}
              >
                <CardMembership className="text-[18px]" />
                <p className="text-[16px]">Memberships</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessGoals")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessGoals" ? "active" : ""
                }`}
              >
                <CategoryOutlined className="text-[18px]" />
                <p className="text-[16px]">Goal</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessSessions")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessSessions" ? "active" : ""
                }`}
              >
                <CategoryOutlined className="text-[18px]" />
                <p className="text-[16px]">Sessions</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessNutrition")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessNutrition" ? "active" : ""
                }`}
              >
                <FoodBankOutlined className="text-[18px]" />
                <p className="text-[16px]">Nutrition</p>
              </button>

              <button
                onClick={() => handleItemClick("FitnessArticles")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessArticles" ? "active" : ""
                }`}
              >
                <ReadOutlined className="text-[18px]" />
                <p className="text-[16px]">Articles</p>
              </button>
              <button
                onClick={() => handleItemClick("FitnessFeedbacks")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "FitnessFeedbacks" ? "active" : ""
                }`}
              >
                <ChatBubbleOutline className="text-[18px]" />
                <p className="text-[16px]">Feedbacks</p>
              </button>
              <button
                onClick={() => handleItemClick("Broadcast")}
                className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                  activeItem === "Broadcast" ? "active" : ""
                }`}
              >
                <BroadcastOnPersonal className="text-[18px]" />
                <p className="text-[16px]">Broadcasts</p>
              </button>
            </div>
          </div>
          <div className="flex py-8 text-black flex-col ga-4 items-center justify-end">
            <button
              onClick={() => handleItemClick("Settings")}
              className={`hover:bg-[#eefef6] flex items-center gap-3 p-3 rounded-lg duration-300 text-[#818181] cursor-pointer transform transition-transform ease-in-out  hover:translate-x-2 ${
                activeItem === "Settings" ? "active" : ""
              }`}
            >
              <SettingOutlined className="text-[18px]" />
              <p className="text-[16px]">Settings</p>
            </button>
            <Popconfirm
              className=" border-none"
              title="Logout"
              description="Are you sure want to Logout?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { backgroundColor: "red" } }}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
            >
              <div
                className="text-black gap-2 flex cursor-pointer items-center justify-center"
                onClick={() => sessionStorage.clear()}
              >
                <LogoutOutlined />
                Logout
              </div>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  )
}

export default centerSideNav
