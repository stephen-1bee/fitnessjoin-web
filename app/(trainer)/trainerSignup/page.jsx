"use client";
import React, { useState } from "react";
import { Input } from "antd";
import Image from "next/image";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { EmailOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "@mui/icons-material";

const TrainerSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // retrive center id and trainer memeberhipid
  let trainer_center_id;
  let trainerMembershipId;
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId");
    trainerMembershipId = sessionStorage.getItem("membershipId");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !location || !password) {
      return toast.error("All fields are required");
    }
    try {
      setLoading(true);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        name: fullName,
        email: email,
        location: location,
        phone: phone,
        center_id: trainer_center_id,
        membership_id: trainerMembershipId,
        password: password,
      });

      let response = await fetch(
        "http://localhost:1000/api/v1/trainers/create",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      let data = await response.json();
      if (data.msg === "Trainer added successfully") {
        toast.success(data.msg);
        console.log(data.msg);
        setLoading(false);
        window.location.href = "/trainerLogin";
      } else {
        toast.error(data.msg);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   if (!fullName || !email || !phone || !location || !password) {
  //     return toast.error("All fields are required");
  //   }
  //   try {
  //     setLoading(true);
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     const raw = JSON.stringify({
  //       name: fullName,
  //       email: email,
  //       location: location,
  //       phone: phone,
  //       center_id: trainer_center_id,
  //       membership_id: membership_id,
  //       password: password,
  //     });

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };

  //     await fetch(
  //       "https://fitness-join-api-xe62.onrender.com/api/v1/trainers/create",
  //       requestOptions
  //     )
  //       .then((response) => response.json())
  //       .then((result) => {
  //         if (result.msg === "Trainer added successfully") {
  //           toast.success(result.msg);
  //           console.log(result.msg);
  //           setLoading(false);
  //           location.href = "/trainerLogin";
  //           setLoading(false);
  //         } else {
  //           toast.error(result.msg);
  //           setLoading(false);
  //         }
  //       })
  //       .catch((error) => console.error(error));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const moveBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-row justify-center items-center min-h-screen m-auto home">
      <div
        className="bg-white rounded-full items-center absolute top-5 left-[45px] cursor-pointer"
        onClick={() => moveBack()}
      >
        <ArrowLeft />
      </div>
      <div>
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="mb-3 m-auto"
        />
        <h1 className="text-xl text-center text-white my-2">Trainer Singup</h1>
        <form className="flex flex-col gap-2 bg-white py-7 px-8 myForm">
          <h1 className="mb-2">Full Name</h1>
          <Input
            prefix={<UserOutlined className="scale-x-[-1]" />}
            className="w-[350px] h-12 rounded-full"
            onChange={(e) => setFullName(e.target.value)}
          />
          <h1 className="mb-2 mt-3">Email</h1>
          <Input
            prefix={<EmailOutlined />}
            className="w-[350px] h-12  rounded-full"
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <h1 className="mb-2 mt-3">Password</h1>
          <Input.Password
            className="w-[350px] h-12  rounded-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <h1 className="mb-2 mt-3">Phone</h1>
          <Input
            placeholder="+123-4932-3453"
            prefix={<PhoneOutlined className="scale-x-[-1]" />}
            className="w-[350px] h-12  rounded-full"
            onChange={(e) => setPhone(e.target.value)}
          />
          <h1 className="mb-2 mt-3">Location</h1>
          <Input
            placeholder="Adringanor"
            prefix={<LocationOnOutlined />}
            onChange={(e) => setLocation(e.target.value)}
            className="py-3  rounded-full"
          />
          <button
            onClick={(e) => handleSignup(e)}
            // type="submit"
            className="px-7 py-4  bg-[#08A88A] text-white mt-5  rounded-full"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <div className="flex mt-2 items-center justify-center ">
          <h1 className="text-[#f1f1f1]">Already having an account? </h1>
          <Link href="/trainerLogin" className=" text-[#08a88a] ml-2">
            <p>Login</p>
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default TrainerSignup;
