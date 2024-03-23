import React from "react";
import Link from "next/link";
import {
  FitnessCenterOutlined,
  KeyboardBackspaceOutlined,
  Person2Outlined,
  SportsGymnasticsOutlined,
} from "@mui/icons-material";

const Getstarted = () => {
  return (
    <div className="text-center bg-background min-h-screen flex justify-center items-center flex-col gap-8 home">
      <div className="flex flex-col items-center">
        <h1 className="text-white text-3xl font-bold">
          Choose what best describes you
        </h1>
        <p className="text-white">Choose your user type</p>
      </div>
      <div className="lg:flex gap-4">
        <Link
          href="/adminSignup"
          className="p-6 rounded-lg text-white ring-[1px] ring-white hover:bg-white w-[180px] cursor-pointer hover:shadow-lg flex flex-col items-center gap-3 transition-all duration-300 mb-5 hover:text-black"
        >
          <FitnessCenterOutlined className="" />
          <p className="font-light">Fitness Center</p>
        </Link>
        <Link
          href="/userFitnessCenters"
          className="p-6 rounded-lg text-white ring-[1px] ring-white hover:bg-white w-[180px] cursor-pointer hover:shadow-lg flex flex-col items-center gap-3 transition-all duration-300 mb-5 hover:text-black"
        >
          <Person2Outlined className="" />
          <p className="font-light ">User</p>
        </Link>
        <Link
          href="/trainerFitnessCenters"
          className="p-6 rounded-lg text-white ring-[1px] ring-white hover:bg-white w-[180px] cursor-pointer hover:shadow-lg flex flex-col items-center gap-3 transition-all duration-300 mb-5 hover:text-black"
        >
          <SportsGymnasticsOutlined className="" />
          <p className="font-light ">Trainer</p>
        </Link>
      </div>
      <Link href="/" className="mt-8 text-white">
        <KeyboardBackspaceOutlined className="text-white back-arrow" /> Back to
        home
      </Link>
    </div>
  );
};

export default Getstarted;
