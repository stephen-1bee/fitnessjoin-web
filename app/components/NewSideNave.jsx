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
import { Popconfirm } from "antd"

const NewSideNave = ({ setActiveItem, activeItem }) => {
  // set active item in session

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

  //   confirm logout
  const confirm = () => {
    location.href = "/adminLogin"
    // onClick={() => sessionStorage.clear()}
  }

  return (
    <div className="justify-center p-2 fixed">
      <div>
        <Image
          className="ml-11 mt-4"
          width={50}
          height={50}
          alt="logo"
          src="/logo.png"
          priority
        />
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
              //   className="border-none"
              title="Logout"
              description="Are you sure want to Logout?"
              onConfirm={confirm}
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
              <div className="text-black gap-2 flex cursor-pointer items-center justify-center py-10">
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

export default NewSideNave
