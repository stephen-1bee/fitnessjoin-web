"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [iscenterId, setCenterId] = useState("");
  const [centerName, setCenterName] = useState("");

  // store fitness id
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("fitnessCenterId", iscenterId);
    sessionStorage.setItem("centerName", centerName);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    try {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: email,
        password: password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("http://localhost:1000/api/v1/admins/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (!email || !password) {
            toast.error("all fields are required");
          } else if (result.msg === "login successful") {
            toast.success(result.msg);
            setLoading(false);
            location.href = "/centerModule";
            setCenterId(result.admin._id);
            setCenterName(result.admin.name);
            console.log(result.admin);
          } else {
            toast.error(result.message);
            setLoading(false);
          }
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen home">
      <div className="items-center flex flex-col">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="mb-3"
        />
        <h1 className="text-2xl  my-5 font-semibold text-white">
          Fitness Admin Login
        </h1>

        <form className="flex flex-col gap-2 bg-white p-8 myForm">
          <h1 className="mt-2">Email</h1>
          <Input
            prefix={<UserOutlined className="scale-x-[-1]" />}
            placeholder="vvu@gmail.com"
            className="w-[350px] h-12 rounded-full pl-5"
            onChange={(e) => setEmail(e.target.value)}
          />

          <h1 className="mt-2">Password</h1>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="password"
            className="w-[350px] h-12 rounded-full pl-5"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="px-7 h-[55px]  bg-[#08a88a] text-white mt-5 rounded-full"
            onClick={(e) => handleLogin(e)}
          >
            {loading
              ? // <Image
                //   src="/loading.gif"
                //   height={80}
                //   width={80}
                //   alt="loading"
                //   className="m-auto"
                // />
                "Signing in..."
              : "Sign in"}
          </button>
        </form>
        <div className="flex gap-5  mt-5 items-center justify-center ">
          <h1 className="text-[#f1f1f1] font-thin">
            Don't have an account?{" "}
            <Link href="/adminSignup" className="text-[#08a88a]">
              Signup
            </Link>
          </h1>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default page;

{
  /* <div className="flex items-center justify-center min-h-screen home" */
}
