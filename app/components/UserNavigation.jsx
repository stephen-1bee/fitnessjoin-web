import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import { NotificationsNoneOutlined } from "@mui/icons-material";
import { Avatar } from "antd";

const UserNavigation = () => {
  const objec = {
    date: "MONDAY, 4 SEP",
  };

  // geting the session storages
  let userFirstName;
  let userLastName;

  if (typeof sessionStorage !== "undefined") {
    userFirstName = sessionStorage.getItem("firstName");
    userLastName = sessionStorage.getItem("lastName");
  }
  return (
    <div>
      <nav className="flex items-center justify-between lg:p-20 p-5 gap-5 bg-navbar h-[10vh]">
        {/* Name & Date */}
        <div className="flex flex-col mt-2 relative p-5">
          <Link
            href="/userLogin"
            className="items-center  absolute -left-2 transform -translate-x-2/5 top-[45%] -translate-y-1/2"
          >
            <ArrowLeftOutlined className="text-btn" />
          </Link>
          <h1 className="text-sm text-gray-500">{objec.date}</h1>
        </div>
        <div className="flex gap-5 items-center justify-center">
          {/* Date & Time */}

          <div className="flex ">
            <h1 className="">
              Hello{" "}
              <span className="text-btn">
                {userFirstName} {userLastName}
              </span>{" "}
            </h1>
            <h1>{objec.time}</h1>
          </div>
          {/* Icons */}
          <div className="cursor-pointer lg:flex gap-3">
            <div className="flex cursor-pointer lg:flex gap-3 items-center ">
              <NotificationsNoneOutlined />
              <Avatar />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserNavigation;
