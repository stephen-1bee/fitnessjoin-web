import { ArrowRight, TapasTwoTone } from "@mui/icons-material"
import { Form, Input, Switch } from "antd"
import React, { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"

const Profile = () => {
  const [trainer, setTrainer] = useState(null)

  const [newName, setnewName] = useState("")
  const [newEmail, setnewEmail] = useState("")
  const [newLocation, setnewLocation] = useState("")
  const [newPhone, setPhone] = useState("")
  const [newPassword, setnewPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

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
        name: newName ? newName : trainer.name,
        email: newEmail ? newEmail : trainer.email,
        location: newLocation ? newLocation : trainer.location,
        phone: newPhone ? newPhone : trainer.phone,
        password: newPassword ? newPassword : trainer.password,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/trainers/update/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "trainer updated successfully") {
            toast.success(result.msg)
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
    <div className="flex gap-5 mt-5">
      <Form className="flex px-20 flex-col gap-4">
        <h1 className="text-3xl">Update Profile</h1>
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
              type="email"
              placeholder="Email"
              className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              defaultValue={trainer ? trainer.location : ""}
            />
          </div>

          <div>
            <h1 className="text-lg">Phone</h1>
            <input
              onChange={(e) => setPhone(e.target.value)}
              type="email"
              placeholder="Email"
              className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              defaultValue={trainer ? trainer.phone : ""}
            />
          </div>
        </div>

        <h1 className="text-lg">Password</h1>
        <input
          onChange={(e) => setTrainer({ ...trainer, password: e.target.value })}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          defaultValue={trainer ? trainer.password : ""}
        />
        <div className="flex gap-2 cursor-pointer">
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          <p>Show Password</p>
        </div>
        <button
          className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white"
          onClick={() => updateTrainer()}
        >
          Save
        </button>
      </Form>

      <div className="flex gap-8 ">
        <h1 className="text-xl">Notifications</h1>
        <Switch />
      </div>
    </div>
  )
}

export default Profile
