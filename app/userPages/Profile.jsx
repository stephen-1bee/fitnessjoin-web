import { ArrowRight } from "@mui/icons-material"
import { Form, Input } from "antd"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

const Profile = () => {
  const [user, setuser] = useState([])
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [phone, setphone] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  console.log(firstname)
  console.log(lastname)
  console.log(email)
  console.log(password)

  let user_id
  if (typeof sessionStorage !== "undefined") {
    user_id = sessionStorage.getItem("userId")
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

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div>
      <h1 className="text-3xl">Update Profile</h1>
      <Form className="flex mt-12 px-20 flex-col gap-4">
        <div className="gap-1">
          <h1 className="text-lg">Firstname</h1>
          <input
            onChange={(e) => setfirstname(e.target.value)}
            type="text"
            placeholder="firstname"
            defaultValue={user.first_name}
            className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          />
        </div>
        <div className="gap-1">
          <h1 className="text-lg">Lastname</h1>
          <input
            onChange={(e) => setlastname(e.target.value)}
            type="text"
            defaultValue={user.last_name}
            placeholder="lastname"
            className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          />
        </div>
        <div className="gap-1">
          <h1 className="text-lg">Email</h1>
          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="email"
            defaultValue={user.email}
            className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          />
        </div>
        <div className="gap-1">
          <h1 className="text-lg">Phone</h1>
          <input
            onChange={(e) => setphone(e.target.value)}
            type="text"
            placeholder="phone number"
            defaultValue={user.phone}
            className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          />
        </div>

        <h1 className="text-lg">Password</h1>
        <input
          onChange={(e) => setuser({ ...user, password: e.target.value })}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
          defaultValue={user ? user.password : ""}
        />
        <div className="flex gap-2 cursor-pointer">
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          <p>Show Password</p>
        </div>
        <button
          onClick={() => updateUser()}
          className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white"
        >
          Save
        </button>
      </Form>
      <Toaster />
    </div>
  )
}

export default Profile
