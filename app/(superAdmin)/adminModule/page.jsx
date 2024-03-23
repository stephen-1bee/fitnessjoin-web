"use client";
import {
  DashboardCustomizeOutlined,
  FeedbackOutlined,
  LogoutOutlined,
  ManageAccountsOutlined,
  MenuOutlined,
  MoneyOutlined,
  PeopleOutline,
  Person3Outlined,
  ReportOutlined,
} from "@mui/icons-material";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <div className="bg-[#edf1f7] min-h-screen flex flex-col ">
        {/* Navigation */}

        <nav className="bg-[#edf1f7] flex  h-12 items-center justify-between p-8 ">
          <Link href="/centerDashboard" className="flex ">
            <Image width={50} height={50} alt="logo" src="/logo.png" />
            <h1 className="flex  font-black ml-1 mt-3 text-lg ">
              Fitness<span className="text-[#21874e]">Join</span>
            </h1>
          </Link>

          {/* User */}

          <p className="flex gap-4 font-semibold">
            Welcome, admin
            <Person3Outlined />
          </p>
        </nav>

        {/* Menu */}

        <MenuOutlined className=" md:hidden  h-6 w-6  absolute right-8 top-20" />

        {/* sideNav */}
        <div className="flex flex-col bg-[#edf4f2] h-[90vh] lg:w-[15%] md:w-[20%] w-[30%] rounded-lg  items-center justify-between ">
          <div className="flex flex-col py-5 gap-2 ">
            <button className=" hover:bg-gray-200 p-3 rounded-lg duration-300">
              <DashboardCustomizeOutlined className="mr-2" />
              Dashboard
            </button>
            <button className=" hover:bg-gray-200 p-3 rounded-lg duration-300 ">
              <ManageAccountsOutlined className="mr-2" />
              Admin Manag
            </button>
            <button className=" hover:bg-gray-200 p-3 rounded-lg duration-300">
              <ReportOutlined className="mr-2" />
              Reports
            </button>
            <button className="  hover:bg-gray-200 p-3 rounded-lg duration-300 ">
              <PeopleOutline className="mr-2" />
              Members
            </button>
            <button className="  hover:bg-gray-200 p-3 rounded-lg duration-300 ">
              <MoneyOutlined className="mr-2" />
              finance
            </button>
            <button className=" hover:bg-gray-200 p-3 rounded-lg duration-300 ">
              <FeedbackOutlined className="mr-2" />
              Feedback
            </button>
          </div>
          <div className="flex py-8">
            <Link
              href="/"
              className="hover:bg-gray-200 rounded-lg duration-300 p-3 "
            >
              <LogoutOutlined className="mr-2" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
