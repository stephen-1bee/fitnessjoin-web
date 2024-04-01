"use client"
import React, { useState } from "react"
import { Input } from "antd"
import Image from "next/image"
import { UserOutlined } from "@ant-design/icons"
import { Toaster, toast } from "react-hot-toast"
import Link from "next/link"
import { ArrowLeft } from "@mui/icons-material"

const TrainerLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [trainer_id, setTrainer_id] = useState("")
  const [trainerName, settrainerName] = useState("")

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("trainerId", trainer_id)
    sessionStorage.setItem("trainerName", trainerName)
  }

  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      return toast.error("All field are required")
    }
    try {
      setLoading(true)
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        email: email,
        password: password,
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      fetch("http://localhost:1000/api/v1/trainers/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "login successful") {
            toast.success(result.msg)
            console.log(result.msg)
            setTrainer_id(result.user._id)
            settrainerName(result.user.name)

            setLoading(false)
            location.href = "/trainerPage"
          } else {
            toast.error(result.msg)
            setLoading(false)
          }
        })
        .catch((error) => console.error(error))
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
          <p className="text-lg text-white">Login as a trainer </p>
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
            <Link href="/trainerSignup" className="text-[#08a88a] ml-2">
              Sign Up
            </Link>
          </h1>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default TrainerLogin
