"use client"
import { PhoneOutlined, UserOutlined } from "@ant-design/icons"
import { Input } from "antd"
import TextArea from "antd/es/input/TextArea"
import React, { useState } from "react"
import Image from "next/image"
import { Toaster, toast } from "react-hot-toast"
// import FitnessAdminLogin from "./FitnessAdminLogin";
import Link from "next/link"
import { LocationOff, LocationOnOutlined } from "@mui/icons-material"

const page = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  const [password, setPassword] = useState("")
  const [businessName, setbusinessName] = useState("")
  const [desc, setDesc] = useState("")
  const [telephone, setTelephone] = useState("")
  const [location, setLocation] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (
      !email ||
      !password ||
      !businessName ||
      !desc ||
      !telephone ||
      !location ||
      !photo
    ) {
      return toast.error("All fields are required")
    }
    try {
      setLoading(true)
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      }

      let bodyContent = new FormData()
      bodyContent.append("name", businessName)
      bodyContent.append("desc", desc)
      bodyContent.append("email", email)
      bodyContent.append("location", location)
      bodyContent.append("phone", telephone)
      bodyContent.append("password", password)
      bodyContent.append("photo", photo[0])

      let response = await fetch("http://localhost:1000/api/v1/admins/create", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      })

      let data = await response.json()
      if (data.msg === "Fitness center created successfully") {
        toast.success(data.msg)
        console.log(data)
        window.location.href = "/adminLogin"
        setLoading(false)
      } else {
        toast.error(data.msg)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen home flex-col gap-2">
      <Image
        src="/logo.png"
        alt="logo"
        width={50}
        height={50}
        className="mb-3"
      />
      <h1 className="text-xl font-bold my-2 text-white">Fitness Signup</h1>
      <form className="flex flex-col gap-2 bg-white p-8 myForm">
        <h1>Photo</h1>
        <input type="file" onChange={(e) => setPhoto(e.target.files)} />

        <h1>Bussiness name</h1>
        <Input
          prefix={<UserOutlined className="scale-x-[-1]" />}
          placeholder="Vvu fitness Center"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setbusinessName(e.target.value)}
        />

        <h1>Email</h1>
        <Input
          prefix={<UserOutlined className="scale-x-[-1]" />}
          placeholder="vvu@gmail.com"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <h1>Password</h1>
        <Input.Password
          placeholder="password"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <h1>Phone</h1>
        <Input
          prefix={<PhoneOutlined className="scale-x-[-1]" />}
          placeholder="233-4903-93094"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setTelephone(e.target.value)}
        />

        <h1>Location</h1>
        <Input
          prefix={<LocationOnOutlined />}
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setLocation(e.target.value)}
        />

        <h1>Descrption</h1>
        <TextArea
          placeholder="A little description about your fitness bussiness"
          className="w-[350px] "
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          onClick={(e) => handleSignUp(e)}
          type="submit"
          className="px-7 py-4  bg-[#08a88a] rounded-full text-white mt-5"
        >
          {loading ? "Signing up..." : "Sing Up"}
        </button>
      </form>
      <div className="flex gap-5  mt-2 items-center justify-center ">
        <h1 className="text-[#f1f1f1] font-thin">
          Already have an account?{" "}
          <Link href="/adminLogin" className="text-[#08a88a]">
            Login
          </Link>
        </h1>
      </div>
      <Toaster />
    </div>
  )
}

export default page
