import React from "react";
import Navbar from "./Navbar";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div
      className="bg-[#f9fafd] min-h-screen flex flex-col justify-center items-center gap-5 py-9 px-24"
      id="About"
    >
      <h1 className="font-bold text-4xl">About FitnessJoin</h1>
      <div className="flex items-center justify-center gap-8">
          <Image 
            width={1000}
            height={1000}
            alt="photo"
            src='/pretty.jpg'
            className="w-[500px] h-[500px] object-contain myImg rounded-2xl"
          />
          <p className="w-[30%] text-lg">FitnessJoin is an all in one SAAS system for Fitness Centers, Trainers and Clients. This Platform is to facilitate effective communication between Fitness Centers, Trainers and Clients.</p>
      </div>
    </div>
  );
};

export default AboutUs;
