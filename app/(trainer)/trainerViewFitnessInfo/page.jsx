"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material"
import { Skeleton } from "antd"
import { PhoneOutlined, FrownOutlined } from "@ant-design/icons"
import moment from "moment"

const handleRating = (rate) => {
  const stars = []

  for (let i = 0; i < rate; i++) {
    stars.push("⭐️ ")
  }

  return stars
}
// format time
const formattedTime = (time) => {
  return moment(time, "HH:mm:ss").format("hh:mm A")
}

const Page = () => {
  const [centerId, setCenterId] = useState(null)
  const [center, setCenter] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Retrieve the center_id from session storage
    const storedCenterId = sessionStorage.getItem("trainerCenterId")

    // Update the state with the retrieved value
    if (storedCenterId) {
      setCenterId(storedCenterId)
    }

    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/admins/one/${storedCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result.admin[0])
          setCenter(result.admin[0])
          setLoading(false)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.error(err)
    }
  }, [])

  console.log(`status: ${center.isOpened}`)

  const moveBack = () => {
    window.history.back()
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-[#f9fafd]">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row gap-12 items-center p-4">
        <div
          className="bg-black rounded-full items-center absolute top-5 left-[45px] cursor-pointer"
          onClick={() => moveBack()}
        >
          <ArrowLeft className="text-white" />
        </div>
        <div className="w-full lg:w-1/2 p-6 lg:p-24 bg-white shadow-lg infoBox mr-[-2rem]">
          <h1 className="text-gray-700">Welcome to</h1>
          {loading ? (
            "Loading fitness center info"
          ) : (
            <div>
              <h2 className="text-6xl font-semibold mb-4">{center.name}</h2>
              <p className="mb-4 text-[#183642] text-2xl mt-[-1rem]">
                {" "}
                {!center.desc ? "No decsription" : center.desc}
              </p>
              <p className="text-[#183642]">
                <LocationOnOutlined className="mr-2" /> {center.location}
              </p>
              <p className="text-[#183642] mb-1">
                <EmailOutlined className="mr-2" />
                {center.email}
              </p>
              <p className="text-[#183642] mb-2 flex items-center gap-3">
                <PhoneOutlined className="scale-x-[-1] " />
                {center.phone}
              </p>
              <h1 className="font-bold text-lg">Working Hours</h1>
              <div className="flex gap-2">
                <p>
                  {center.opening_time
                    ? formattedTime(center.opening_time)
                    : "N/A"}
                </p>
                <h1> to </h1>
                <p>
                  {center.closing_time
                    ? formattedTime(center.closing_time)
                    : "N/A"}
                </p>
              </div>
              <p>
                {center.rating === 0 ? (
                  <p className="gray-700">No ratings yet </p>
                ) : (
                  handleRating(center.rating).map((star, index) => (
                    <span key={index}>{star}</span>
                  ))
                )}
              </p>
              <p className="my-4 mb-9">
                {center.isOpened ? (
                  <div className="bg-[#d0fff6] p-3 px-9 border-l-[3px] border-l-[#08A88A] w-full">
                    <p>Opened</p>
                  </div>
                ) : (
                  <div className="bg-[#ffd5cd] p-3  px-9 border-l-[3px] border-l-[tomato] w-full">
                    <p>Closed</p>
                  </div>
                )}
              </p>
              <div className="my-5"></div>
              {center.isOpened === true ? (
                <div>
                  <Link
                    href="trainerMembership"
                    className="bg-[#08A88A] text-text text-md py-4 px-[5rem] rounded-full w-[100%]"
                  >
                    Register Now
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FrownOutlined />
                  <p>This fitness center has closed registration</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/2">
          {center.photo ? (
            <div className="bg-white p-6 rounded-lg shadow ml-[-2rem] relative">
              {center.photo ? (
                <Image
                  width={500}
                  height={400}
                  alt="Center Photo"
                  src={`http://localhost:1000/${center.photo}`}
                  className="rounded-md photoDetail w-full object-cover h-[500px]"
                />
              ) : (
                <div className="absolute inset-0 bg-black opacity-50" />
              )}
            </div>
          ) : (
            <Skeleton active />
          )}
        </div>
      </div>
    </main>
  )
}

export default Page
