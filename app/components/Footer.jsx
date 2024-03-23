"use client";
import React, { useState } from "react";
import { FloatButton } from "antd";
import { Toaster, toast } from "react-hot-toast";
import { Facebook, WhatsApp } from "@mui/icons-material";

const Footer = () => {
  const [name, setname] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);

  // send message
  // const handleMessage = async (e) => {
  //   e.preventDefault();
  //   if (!name || !message) {
  //     return toast.error("all fields are required");
  //   }
  //   try {
  //     setloading(true);
  //     let headersList = {
  //       Accept: "*/*",
  //       "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  //       "Content-Type": "application/json",
  //     };

  //     let bodyContent = JSON.stringify({
  //       name: name,
  //       message: message,
  //     });

  //     let response = await fetch(
  //       "https://fitness-join-api-xe62.onrender.com/api/v1/contactUs/create",
  //       {
  //         method: "POST",
  //         body: bodyContent,
  //         headers: headersList,
  //       }
  //     );
  //     let data = await response.json();
  //     if (data.msg === "message sent successfuly") {
  //       toast.success(data.msg);
  //       setloading(false);
  //       console.log(data);
  //     } else {
  //       toast.error(data.msg);
  //       setloading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleMessage = async (e) => {
    e.preventDefault();
    if (!name || !message) {
      return toast.error("All fields are required");
    }
    try {
      setloading(true);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        name: name,
        message: message,
      });

      let response = await fetch(
        "https://fitness-join-api-xe62.onrender.com/api/v1/contactUs/create",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );
      let data = await response.json();
      if (data.msg === "message sent successfuly") {
        toast.success(data.msg);
        setloading(false);
        setname("");
        setMessage("");
      } else {
        toast.error(data.msg);
        setloading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="flex flex-col bg-[#183642] w-[100%] min-h-[40vh] pt-18"
      id="Footer"
    >
      <div className="flex p-5 text-gray-500 justify-between">
        <div className="flex flex-col max-w-[400px] mx-auto py-18">
          <div>
            <h1 className="mb-3 text-white text-center text-2xl font-semibold mt-11">
              Connect With Us
            </h1>
            <p className="text-[#d6d6d6] text-center mb-3">
              Feel free to reach us today
            </p>
          </div>
         
          <form action="" className="flex flex-col mb-11 gap-2 w-full">
            <input
              type="name"
              placeholder="Your name"
              id="info"
              onChange={(e) => setname(e.target.value)}
              className="bg-gray-200 p-2 rounded-lg bg-transparent border-[1-px] border-[#ccc] outline-[#08A88A] text-[#08A88A] font-semibold placehoder:text-[#ccc] outline-none placeholder:text-[#9d9d9d] w-full"
            />
            <textarea
              type="text"
              placeholder="Type your message..."
              id="name"
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-200 p-2 rounded-lg bg-transparent border-[1-px] border-[#ccc] outline-[#08A88A] text-[#08A88A] font-semibold placehoder:text-[#ccc] outline-none placeholder:text-[#9d9d9d] mt-2 w-[100%]"
            />
            <button
              onClick={(e) => handleMessage(e)}
              type="submit"
              className="p-3 mt-3 bg-[#08A88A] text-text rounded-full outline-none"
            >
              {loading ? "Sending message..." : "Send Message"}
            </button>
          </form>
        </div>
        <FloatButton.BackTop className="hover:bg-[#edf1f7] transition-all shadow-md" />
      </div>
      <div className="flex bg-[#08A88A] h-20 justify-between items-center text-white text-sm px-5">
        <div className="space-x-2">
          <Facebook />
          <WhatsApp />
        </div>
        <h1 className="font-sans-serif mr-[10%]">© All rights reserved</h1>
      </div>
      <Toaster />
    </div>
  );
};

export default Footer;
