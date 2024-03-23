import React from "react";
import Link from "next/link";
import { NotificationsNoneOutlined } from "@mui/icons-material";
import { Avatar } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const TrainerNavigation = () => {
  const objec = {
    trainer: "Trainer",
    time: "10:30 PM",
    date: "MONDAY, 4 SEP",
  };
  return (
    <nav className="flex items-center justify-between lg:p-20 p-5 gap-5 bg-navbar h-[10vh]">
      {/* Name & Date */}
      <div className="flex flex-col mt-2 relative p-5">
        <Link
          href="/trainerPage"
          className="items-center  absolute -left-2 transform -translate-x-2/5 top-[45%] -translate-y-1/2"
        >
          <ArrowLeftOutlined className="text-btn" />
        </Link>
        <h1 className="text-sm text-gray-500">{objec.date}</h1>
      </div>
      <div className="flex gap-5 ">
        {/* Icons */}
        <div className="cursor-pointer lg:flex gap-3">
          <div className="flex cursor-pointer lg:flex gap-3 items-center ">
            <h1 className="font-black">
              <span className="text-btn">{objec.trainer}</span>{" "}
            </h1>
            <NotificationsNoneOutlined />
            <Avatar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TrainerNavigation;
