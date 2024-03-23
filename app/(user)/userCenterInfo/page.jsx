"use client";
import React from "react";
import Image from "next/image";
import {
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  ExpandMoreOutlined as ExpandMoreOutlinedIcon,
  ReportOutlined as ReportOutlinedIcon,
  CardMembershipOutlined as CardMembershipOutlinedIcon,
  TimelapseOutlined as TimelapseOutlinedIcon,
  InsightsOutlined as InsightsOutlinedIcon,
  NoFoodOutlined as NoFoodOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { ArrowLeftOutlined, PhoneOutlined } from "@ant-design/icons";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import UserNavigation from "@/app/components/UserNavigation";

const userCenterInfo = () => {
  const objec = {
    name: "Centert Info",
    date: "MONDAY, 4 SEP",
  };

  // calling the session storages
  let userFirstName;
  let userLastName;

  if (typeof sessionStorage !== "undefined") {
    userFirstName = sessionStorage.getItem("firstName");
    userLastName = sessionStorage.getItem("lastName");
  }

  const [center, setcenter] = useState([]);

  // storing user's FitnessCenterId
  let trainerCenter;
  if (typeof sessionStorage !== "undefined") {
    trainerCenter = sessionStorage.getItem("user_center");
  }

  const handleCenter = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      await fetch(
        `https://fitness-join-api-xe62.onrender.com/api/v1/admins/one/${userCenter}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setcenter(result.admin);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleCenter();
  }, []);

  return (
    <div className="min-h-screen  bg-[#edf1f7] ">
      <UserNavigation />
      {/* card */}
      <div className="flex items-center justify-center mt-5">
        {center.map((filterCenter) => (
          <div className="flex flex-col gap-2 bg-white p-9 rounded-md">
            <h1 className="font-bold">{filterCenter.name}</h1>
            <div className="flex items-center gap-3">
              <EmailOutlined />
              <p>{filterCenter.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <PhoneOutlined />
              <p>{filterCenter.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <LocationOnOutlined />
              <p>{filterCenter.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default userCenterInfo;
