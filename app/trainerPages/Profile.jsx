import { UserOutlined } from "@ant-design/icons"
import {
  ArrowRight,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material"
import { Avatar, Form, Input, Switch } from "antd"
import React, { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"

const Profile = () => {
  const [trainer, setTrainer] = useState(null)

  const [newName, setnewName] = useState("")
  const [newEmail, setnewEmail] = useState("")
  const [newLocation, setnewLocation] = useState("")
  const [newPhone, setPhone] = useState("")

  // get trainer id
  let trainer_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
  }

  const getTrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/one/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainer(result.trainer[0])
          console.log(result.trainer[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getTrainer()
  }, [])

  const updateTrainer = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        name: newName ? newName : trainer?.name,
        email: newEmail ? newEmail : trainer?.email,
        location: newLocation ? newLocation : trainer?.location,
        phone: newPhone ? newPhone : trainer?.phone,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/update/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "trainer updated successfully") {
            toast.success(result.msg)
            getTrainer()
            console.log(result)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1 className="text-3xl">Profile</h1>
      <div className="lg:flex-row flex gap-5 mt-5 w-full bg-white shadow-md rounded-lg py-20 md:flex-col flex-col ">
        <div className="p-10 shadow bg-white rounded-lg w-[500px] items-center justify-center">
          <div className="flex flex-col">
            {/* profile */}
            <div className="items-center justify-center flex">
              <Avatar size={70} icon={<UserOutlined />} />
            </div>
            <h1 className="text-2xl font-semibold text-center">
              {trainer?.name}
            </h1>
            <p className="text-center text-[15px] text-gray-600">
              {trainer?.fitness_center[0]?.name}
            </p>
            <div className="border-b border-[#ccc] py-1" />
          </div>
          <div className="flex mt-5 items-center justify-between">
            <div className="flex gap-2">
              <EmailOutlined />
              <p className=" text-gray-600 ">{trainer?.email}</p>
            </div>
            <h1 className=" text-gray-600">50+ trained people</h1>
          </div>
          <div className="text-center py-2">
            <LocationOnOutlined />
            {trainer?.location}
          </div>
        </div>

        <Form className="flex px-20 flex-col gap-4 items-center justify-center">
          <div className="flex gap-5">
            <div>
              <h1 className="text-lg">Fullname</h1>
              <input
                type="text"
                placeholder="Trainer name"
                onChange={(e) => setnewName(e.target.value)}
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
                defaultValue={trainer ? trainer.name : ""}
              />
            </div>

            <div>
              <h1 className="text-lg">Email</h1>
              <input
                onChange={(e) => setnewEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
                defaultValue={trainer ? trainer.email : ""}
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div>
              <h1 className="text-lg">Location</h1>
              <input
                onChange={(e) => setnewLocation(e.target.value)}
                type="text"
                placeholder="Email"
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
                defaultValue={trainer ? trainer.location : ""}
              />
            </div>

            <div>
              <h1 className="text-lg">Phone</h1>
              <input
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
                defaultValue={trainer ? trainer.phone : ""}
              />
            </div>
          </div>

          <button
            className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white m-auto mt-5"
            onClick={() => updateTrainer()}
          >
            Save
          </button>
        </Form>
        <Toaster />
      </div>
    </div>
  )
}

export default Profile
