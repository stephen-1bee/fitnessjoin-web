import { PhoneOutlined, UserOutlined } from "@ant-design/icons"
import {
  ArrowRight,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material"
import { Avatar, Form, Input } from "antd"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

const Profile = () => {
  const [user, setuser] = useState(null)
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [phone, setphone] = useState("")
  const [goalField, setgoalField] = useState("")

  const [goal, setGoal] = useState([])
  const [showPassword, setShowPassword] = useState(false)

  let user_id
  let userCenterId
  if (typeof sessionStorage !== "undefined") {
    user_id = sessionStorage.getItem("userId")
    userCenterId = sessionStorage.getItem("userCenterId")
  }

  // get single user
  const getUser = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/one/${user_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setuser(result.user[0])
          console.log(result.user[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const updateUser = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        first_name: firstname ? firstname : user.first_name,
        last_name: lastname ? lastname : user.last_name,
        email: email ? email : user.email,
        phone: phone ? phone : user.phone,
        goal: goalField ? goalField : user.goal,
        password: password ? password : user.password,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/update/${user_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "user updated successfully") {
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

  const getFitnessGoals = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/center/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setGoal(result.center_goals)
          console.log(result.center_goals)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
    getFitnessGoals()
  }, [])

  return (
    <div>
      <h1 className="text-3xl"> Profile</h1>
      <div className="lg:flex-row flex gap-5 mt-5 items-center justify-center bg-white shadow-lg">
        <div className="p-10 shadow bg-white rounded-lg w-[500px] h-[500px]">
          <div className="flex flex-col">
            {/* name */}
            <div className="items-center justify-center flex">
              <Avatar size={70} icon={<UserOutlined />} />
            </div>
            <div className="flex gap-1 items-center justify-center">
              <h1 className="text-2xl font-semibold text-center">
                {user?.first_name}
              </h1>
              <h1 className="text-2xl font-semibold text-center">
                {user?.last_name}
              </h1>
            </div>

            <p className="text-center text-[15px] text-gray-600">
              {user?.fitness_center[0]?.name}
            </p>
            <div className="border-b border-[#ccc] py-1" />
          </div>

          <div className="flex mt-5 items-center justify-between">
            <div className="flex gap-2">
              <EmailOutlined />
              <p className=" text-gray-600 ">{user?.email}</p>
            </div>
            <h1 className=" text-gray-600 gap-1 flex items-center">
              <PhoneOutlined className="transform scale-x-[-1]" />
              {user?.phone}
            </h1>
          </div>
          <div className="flex mt-5 items-center justify-between">
            <div>
              <LocationOnOutlined />
              {user?.location}
            </div>
            <div>{user?.goal}</div>
          </div>
        </div>

        {/* form */}
        <Form className="flex  px-20 flex-col gap-5 ">
          <div className="flex gap-5">
            <div className="gap-1">
              <h1 className="text-lg">Firstname</h1>
              <input
                onChange={(e) => setfirstname(e.target.value)}
                type="text"
                placeholder="firstname"
                defaultValue={user?.first_name}
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              />
            </div>
            <div className="gap-1">
              <h1 className="text-lg">Lastname</h1>
              <input
                onChange={(e) => setlastname(e.target.value)}
                type="text"
                defaultValue={user?.last_name}
                placeholder="lastname"
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="gap-1">
              <h1 className="text-lg">Email</h1>
              <input
                onChange={(e) => setemail(e.target.value)}
                type="email"
                placeholder="email"
                defaultValue={user?.email}
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              />
            </div>
            <div className="gap-1">
              <h1 className="text-lg">Phone</h1>
              <input
                onChange={(e) => setphone(e.target.value)}
                type="text"
                placeholder="phone number"
                defaultValue={user?.phone}
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <h1 className="text-lg">Goal</h1>
              <select
                value={user ? user?.goal : ""}
                onChange={(e) => setgoalField(e.target.value)}
                className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
              >
                <option value="">Select a goal from this fitness center</option>
                {goal?.map((g) => (
                  <option key={g.goal} value={g.goal}>
                    {g.goal}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => updateUser()}
              className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white text-center flex items-center justify-center"
            >
              <h1 className="text-center">Save</h1>
            </button>
          </div>
        </Form>
        <Toaster />
      </div>
    </div>
  )
}

export default Profile
