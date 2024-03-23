"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { Input, Select } from "antd";
import { EmailOutlined } from "@mui/icons-material";
import UserLogin from "@/app/components/UserLogin";
import UserSignup from "@/app/components/UserSignup";

const userSignupForm = () => {
  const [activeState, setactiveState] = useState("signup");

  const handleActive = (active) => {
    setactiveState(active);
  };

  const render = () => {
    switch (activeState) {
      case "login":
        return <UserLogin />;
      case "signup":
        return <UserSignup />;
      default:
        return <UserSignup />;
    }
  };

  useEffect(() => {
    setactiveState("login");
  }, []);

  return (
    <div className="flex flex-row justify-center items-center min-h-screen m-auto home">
      {/* left view */}
      <div className="flex flex-col items-center  w-full h-[100vh] justify-center  ">
        {render()}
        <button
          onClick={() => handleActive("login")}
          className="text-[#08A88A]"
        >
          {activeState === "login" ? "" : "login"}
        </button>
        <button
          onClick={() => handleActive("signup")}
          className="text-[#08A88A]"
        >
          {activeState === "signup" ? "" : "signup"}
        </button>
      </div>

      {/* right view */}
      {/* <div className="lg:flex flex-col items-center w-[50%] h-[100vh]  hidden">
        <Image
          src="/user.jpeg"
          alt="users image"
          width={1700}
          height={1500}
          className="h-[100vh] object-cover "
        />
      </div> */}
      <Toaster />
    </div>
  );
};

export default userSignupForm;

// <div className="w-fit">
//           <h1 className="text-2xl">My Membership Plan</h1>
//           <br />
//           <div className="p-5 bg-[dodgerblue] text-white rounded shadow-2xl md:flex-row flex  flex-col-reverse gap-5 w-fit">
//             {userMembership ? (
//               <div className="w-full">
//                 <h2 className="text-xl font-bold">
//                   {userMembership ? userMembership[0]?.name : null }
//                 </h2>
//                 <div className="text-white mt-2">
//                   {/* <Message/> */}
//                   <p>
//                     <span className="text-sm">GHS </span>
//                     <span className="font-bold text-xl">
//                       {userMembership ? userMembership[0]?.price : null}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="text-white mt-2 gap-2 flex">
//                   {/* <EmailOutlined /> */}
//                   {/* {userMembership ? user[0]?.fitness_center[0].name : null} */}
//                 </div>
//                 {/* <div className="text-white mt-2 gap-2 flex">
//               <LocationOnOutlined />
//               {userCenter ? userCenter[0]?.location : null}
//             </div>
//             <div className="text-white mt-2 gap-2 flex">
//               <Phone />
//               {userCenter ? userCenter[0]?.phone : null}
//             </div>
//             <div className="text-white mt-2 gap-2 flex">
//               Rating: {userCenter ? userCenter[0]?.rating : null}
//             </div> */}
//                 {/* <button className="bg-white p-2 rounded-full w-full mt-4 text-[#08a88a]">
//               View Details
//             </button> */}
//               </div>
//             ) : (
//               "loading.."
//             )}
//             <div className="ml-24 items-center justify-center flex">
//               {/* <Image
//               width={300}
//               height={300}
//               alt="fitness image"
//               className="h-[300px] w-[300px] object-cover"
//               src={{ uri: userCenter ? userCenter?.photo : null }}
//             /> */}
//               {/* <p>{userCenter[0]?.photo}</p> */}
//             </div>
//           </div>
//         </div>
