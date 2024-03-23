"use client";
import { UserOutlined } from "@ant-design/icons";
import {
  FitnessCenter,
  PersonOutlineOutlined,
  SportsGymnastics,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "@mui/icons-material";

const page = () => {
  const moveBack = () => {
    window.history.back();
  };
  return (
    <div className="home min-h-screen flex flex-col items-center justify-center">
      <div
        className="bg-white rounded-full items-center absolute top-5 left-[45px] cursor-pointer"
        onClick={() => moveBack()}
      >
        <ArrowLeft />
      </div>
      <div className="flex flex-col items-center gap-1 mb-[2rem]">
        <h1 className="text-white text-3xl font-black">
          Choose your user type
        </h1>
        <p className="text-white">Choose your user type to continue</p>
      </div>
      <div className="mt-[3rem] flex items-center gap-6">
        <div className="text-white flex flex-col gap-3 items-center">
          <Link
            href="/adminLogin"
            className="ring-[1px] ring-white p-8 rounded-full hover:bg-white hover:text-black"
          >
            <FitnessCenter />
          </Link>
          <p>Fitness Center</p>
        </div>
        <div className="text-white flex flex-col gap-3 items-center">
          <Link
            href="/existingUserLogin"
            className="ring-[1px] ring-white p-8 rounded-full hover:bg-white hover:text-black"
          >
            <PersonOutlineOutlined />
          </Link>
          <p>Client</p>
        </div>
        <div className="text-white flex flex-col gap-3 items-center">
          <Link
            href="/existingTrainerLogin"
            className="ring-[1px] ring-white p-8 rounded-full hover:bg-white hover:text-black"
          >
            <SportsGymnastics />
          </Link>
          <p>Trainer</p>
        </div>
      </div>
    </div>
  );
};

export default page;
