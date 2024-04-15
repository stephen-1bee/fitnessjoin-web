"use client"
import { UserOutlined } from "@ant-design/icons"
import { Input } from "antd"
import React, { useState } from "react"
import Image from "next/image"
import { Toaster, toast } from "react-hot-toast"
import Link from "next/link"
import { ArrowLeft } from "@mui/icons-material"

const UserLogin = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  let userCenterId
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
  }

  const [user_id, setuser_id] = useState("")
  const [userCenter_id, setuserCenterId] = useState("")

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("userId", user_id)
    sessionStorage.setItem("userCenterId", userCenter_id)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      return toast.error("All field are required")
    }
    try {
      setLoading(true)
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        email: email,
        password: password,
      })

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch("http://localhost:1000/api/v1/users/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // if (result.user.center_id !== userCenterId) {
          //   setLoading(false);
          //   return toast.error("You do not belong to this Fitness Center");
          // }
          if (result.msg === "login successful") {
            toast.success(
              `Welcome ${result.user.first_name} ${result.user.last_name}`
            )
            console.log(result.msg)
            setLoading(false)
            setuser_id(result.user._id)
            setuserCenterId(result.user?.center_id)

            location.href = "/userPage"
          } else {
            toast.error(result.msg)
            setLoading(false)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }
  const moveBack = () => {
    window.history.back()
  }
  return (
    <div className="flex flex-row justify-center items-center min-h-screen m-auto home">
      <div
        className="bg-white rounded-full items-center absolute top-5 left-[45px] cursor-pointer"
        onClick={() => moveBack()}
      >
        <ArrowLeft />
      </div>
      <div className="items-center flex flex-col">
        <Image
          src="/logo.png"
          alt="logo"
          width={90}
          height={90}
          className="mb-3"
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl  font-bold text-white">
            We are ready for you
          </h1>
          <p className="text-lg text-white">Login to continue</p>
        </div>
        <form className="flex flex-col gap-2 bg-white p-17 px-8 py-8 mt-6 myForm">
          <p className="mt-2 text-[#183642]">Email</p>
          <Input
            prefix={<UserOutlined className="scale-x-[-1]" />}
            placeholder="vvu@gmail.com"
            className="w-[350px] h-12 rounded-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="mt-2 text-[#183642]">Password</p>
          <Input.Password
            placeholder="Password"
            className="w-[350px] h-12 rounded-full"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="px-7 py-4  bg-[#08A88A] rounded-full text-white mt-5"
            onClick={(e) => handleLogin(e)}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="flex gap-5  mt-5 items-center justify-center ">
          <h1 className="text-[#f1f1f1] font-thin">
            Don't have an account?
            <Link href="/userSignup" className="text-[#08a88a] ml-2">
              Sign Up
            </Link>
          </h1>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default UserLogin

// <div className="flex flex-row justify-center items-center min-h-screen m-auto home">
