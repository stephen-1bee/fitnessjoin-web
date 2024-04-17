import React, { useState, useEffect } from "react"
import {
  MessageOutlined,
  PhoneOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import {
  ArrowRight,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material"
import { Drawer, Popconfirm, TimePicker } from "antd"
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image"
import moment from "moment"

function FitnessSettings() {
  const [admin, setAdmin] = useState([])
  const [profileModal, setprofileModal] = useState(false)

  // get admin id
  let centerId
  if (typeof sessionStorage !== "undefined") {
    centerId = sessionStorage.getItem("fitnessCenterId")
  }

  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  const [businessName, setbusinessName] = useState("")
  const [desc, setDesc] = useState("")
  const [telephone, setTelephone] = useState("")
  const [location, setLocation] = useState("")
  const [openingTime, setOpeningTime] = useState("")
  const [closingTime, setClosingTime] = useState("")

  const formattedTime = (time) => {
    return moment(time, "HH:mm:ss").format("hh:mm A")
  }

  const handleUpdate = async (adminId) => {
    try {
      const formdata = new FormData()
      formdata.append("photo", photo ? photo : admin.photo)
      formdata.append("email", email ? email : admin.email)
      formdata.append("location", location ? location : admin.location)
      formdata.append("phone", telephone ? telephone : admin.phone)
      formdata.append("name", businessName ? businessName : admin.name)
      formdata.append("desc", desc ? desc : admin.desc)
      formdata.append(
        "opening_time",
        openingTime ? openingTime : admin.opening_time
      )
      formdata.append(
        "closing_time",
        closingTime ? closingTime : admin.closing_time
      )

      const requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow",
      }
      await fetch(
        `http://localhost:1000/api/v1/admins/update/${adminId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "admin updated successfully") {
            toast.success(result.msg)
            console.log(result)
            setprofileModal(false)
            getAdmin()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpenProfile = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/open/${centerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Profile opended successfully") {
            toast.success(result.msg)
            getAdmin()
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

  // get admin data
  const getAdmin = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/one/${centerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAdmin(result.admin)
          getAdmin()
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAdmin()
  }, [])

  const handleCloseProfile = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/close/${centerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Profile closed successfully") {
            toast.success(result.msg)
            fetchFitnessCenter()
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
      <h2 className="font-bold text-2xl">Settings</h2>
      <div className="mt-4 bg-white p-7 rounded-lg shadow-2xl w-[500px]">
        <p>Control your settings</p>
        <div className="mt-7 flex flex-items justify-between">
          <div className="flex items-center gap-5">
            <p>Registration Status</p>
            <p>
              {admin.isOpened === true ? (
                <span className="bg-[#c5ffdf] p-2 rounded-full">Opened</span>
              ) : (
                <span className="bg-[#ffd5ce] p-2 rounded-full">Closed</span>
              )}
            </p>
          </div>

          {admin.isOpened === true ? (
            <Popconfirm
              description="Do you want to disable registration?"
              okText="Enable"
              okButtonProps={{
                style: { backgroundColor: "#c83a3a", color: "white" },
              }}
              onConfirm={() => handleCloseProfile()}
            >
              <button>Disable</button>
            </Popconfirm>
          ) : (
            <Popconfirm
              description="Do you want to enable notifications?"
              okText="Enable"
              okButtonProps={{
                style: {
                  backgroundColor: "#08a88a",
                  color: "white",
                },
              }}
              onConfirm={() => handleOpenProfile()}
            >
              <button>Enable</button>
            </Popconfirm>
          )}
        </div>
        <div
          onClick={() => setprofileModal(true)}
          className=" cursor-pointer rounded-lg w-fit py-3 mt-5 bg-[#08a88a] text-white px-9"
        >
          Update Profile
        </div>
      </div>
      {/* update drawer */}
      <Drawer
        title="Update Profile"
        open={profileModal}
        onClose={() => setprofileModal(false)}
        footer={[false]}
        width={720}
      >
        <div className="flex items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center rounded-lg p-5">
            <div className="items-center flex flex-col">
              <div className="flex flex-col gap-2">
                <Image
                  className="rounded-lg w-[150px] h-[150px] object-cover"
                  src={`http://localhost:1000/${admin.photo}`}
                  height={500}
                  width={500}
                  alt="image"
                />
                <p className="flex gap-1 items-center py-2">{admin.name}</p>
              </div>
              <div className="border-b w-full border-gray-200 mb-2" />

              <div className="flex flex-col">
                <div className="flex items-center gap-5 justify-between w-full">
                  <p className="flex gap-1">
                    <EmailOutlined />
                    {admin.email}
                  </p>

                  <p className="items-center flex gap-1">
                    <PhoneOutlined className="scale-x-[-1] ml-[2px]" />
                    {admin.phone}
                  </p>
                </div>
                <br />
                {/* working hours */}
                <h1>Working hours</h1>
                <div className="flex items-center justify-between w-full">
                  <div className="w-full">
                    {formattedTime(admin.opening_time)}
                  </div>
                  <div className="w-full">
                    {formattedTime(admin.closing_time)}
                  </div>
                </div>
              </div>

              <br />

              <p className="flex gap-1">
                <LocationOnOutlined />
                {admin.location}
              </p>

              <p className="items-center flex gap-2 mt-2">
                <MessageOutlined className="scale-x-[-1] ml-[2px]" />
                {admin.desc}
              </p>
            </div>
          </div>

          {/* form */}
          <div className="flex flex-col gap-3 w-[300px]">
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

            <h1 className="text-lg">Bussiness Name</h1>
            <input
              onChange={(e) => setbusinessName(e.target.value)}
              type="text"
              defaultValue={admin.name}
              placeholder="Bussiness name"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Email</h1>
            <input
              defaultValue={admin.email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Bussiness name"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3"
            />

            <h1 className="text-lg">Phone</h1>
            <input
              onChange={(e) => setTelephone(e.target.value)}
              defaultValue={admin.phone}
              type="text"
              placeholder="123-237-1923"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Location</h1>
            <input
              onChange={(e) => setLocation(e.target.value)}
              defaultValue={admin.location}
              type="text"
              placeholder="Location"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Descrption</h1>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              defaultValue={admin.desc}
              type="text"
              placeholder="Description"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <div className="flex gap-5 items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <h1 className="text-[17px]">Opening Time</h1>
                <h1>{formattedTime(admin.opening_time)}</h1>
                <TimePicker
                  // defaultValue={formattedTime(admin[0]?.opening_time)}
                  className="py-4"
                  onChange={(date, dateString) => setOpeningTime(dateString)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-[17px]">Closing Time</h1>
                <h1>{formattedTime(admin.closing_time)}</h1>
                <TimePicker
                  // defaultValue={formattedTime(admin[0]?.closing_time)}
                  className="py-4"
                  onChange={(date, dateString) => setClosingTime(dateString)}
                />
              </div>
            </div>

            <button
              onClick={() => handleUpdate(admin._id)}
              className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white text-center flex items-center justify-center"
            >
              <h1 className="text-center">Save</h1>
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default FitnessSettings
