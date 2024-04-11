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
  Tag,
} from "@mui/icons-material"
import { Drawer, Popconfirm } from "antd"
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image"

const FitnessSettings = () => {
  // State variables
  const [admin, setAdmin] = useState([])

  const [profileModal, setprofileModal] = useState(false)

  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  const [businessName, setbusinessName] = useState("")
  const [desc, setDesc] = useState("")
  const [telephone, setTelephone] = useState("")
  const [location, setLocation] = useState("")

  // Retrieve admin ID from session storage
  const centerId = sessionStorage.getItem("fitnessCenterId")

  let notificationStatus
  let profileStatus
  if (typeof sessionStorage !== "undefined") {
    notificationStatus = sessionStorage.getItem("notification")
    profileStatus = sessionStorage.getItem("profile")
  }

  const [isOpened, setIsOpened] = useState(profileStatus)
  const [isNotificationOpened, setIsNotificationOpened] =
    useState(notificationStatus)

  // Function to fetch fitness center data
  const fetchFitnessCenter = async () => {
    try {
      const response = await fetch(
        `http://localhost:1000/api/v1/admins/one/${centerId}`
      )
      const result = await response.json()
      sessionStorage.setItem("notification", result.admin[0].isNotification)
      sessionStorage.setItem("profile", result.admin[0].isOpened)
      // Set admin state and open status
      setAdmin(result.admin)
      setIsOpened(result.admin?.isOpened)
      setIsNotificationOpened(result.admin?.isNotification)
    } catch (error) {
      console.error("Error fetching fitness center data:", error)
    }
  }

  const handleOpenNotification = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/notification/on/${centerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned on") {
            toast.success("Notifications enabled")
            console.log(result)
            fetchFitnessCenter()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleCloseNotification = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/notification/off/${centerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification has been turned off") {
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

  // Fetch fitness center data on component mount
  useEffect(() => {
    fetchFitnessCenter()
  }, [])

  // hanlde update
  const handleUpdate = async (adminId) => {
    try {
      const formdata = new FormData()
      formdata.append("photo", photo ? photo : admin[0].photo)
      formdata.append("email", email ? email : admin[0]?.email)
      formdata.append("location", location ? location : admin[0]?.location)
      formdata.append("phone", telephone ? telephone : admin[0]?.phone)
      formdata.append("name", businessName ? businessName : admin[0]?.name)
      formdata.append("desc", desc ? desc : admin[0]?.desc)

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
      <div className="flex gap-2 items-center">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <SettingOutlined className="text-white text-lg" />
        </div>
        <h1 className="text-2xl">Settings</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Settings
      </p>

      <div className="bg-white p-7 rounded-lg shadow">
        {admin.map((ad) => (
          <div key={ad.id}>
            <div className="mt-10 flex gap-8 items-center">
              <h1 className="text-xl">Open Registration</h1>
              <p>
                {profileStatus === "true" ? (
                  <span className="bg-[#08a88a] text-white p-3 rounded-full px-5">
                    Enabled
                  </span>
                ) : (
                  <span className="bg-[#c83a3a] text-white p-3 rounded-full px-5">
                    Disabled
                  </span>
                )}
              </p>
              {profileStatus === "true" ? (
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
                  description="Do you want to enable registration?"
                  okText="Enable"
                  okButtonProps={{
                    style: { backgroundColor: "#08a88a", color: "white" },
                  }}
                  onConfirm={() => handleOpenProfile()}
                >
                  <button>Enable</button>
                </Popconfirm>
              )}
            </div>

            <div className="mt-10 flex gap-8 items-center">
              <h1 className="text-xl">Notifications</h1>

              <div className="flex">
                <div className="flex items-center gap-5">
                  {notificationStatus === "true" ? (
                    <div className="flex items-center gap-6">
                      <p className="bg-[#08a88a] text-white p-3 rounded-full px-5">
                        Enabled
                      </p>
                      {notificationStatus === "true" ? (
                        <Popconfirm
                          description="Do you want to disable notifications?"
                          okText="Disable"
                          okButtonProps={{
                            style: {
                              backgroundColor: "#c83a3a",
                              color: "white",
                            },
                          }}
                          onConfirm={() => handleCloseNotification()}
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
                          onConfirm={() => handleOpenNotification()}
                        >
                          <button>ENABLE IS HERE</button>
                        </Popconfirm>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-8">
                      <p className="bg-[#c83a3a] text-white p-3 rounded-full px-5">
                        Disabled
                      </p>
                      <Popconfirm
                        description="Do you want to enable notifications?"
                        okText="Enable"
                        okButtonProps={{
                          style: { backgroundColor: "#08a88a", color: "white" },
                        }}
                        onConfirm={() => handleOpenNotification()}
                      >
                        <button>Enable</button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div
          onClick={() => setprofileModal(true)}
          className=" cursor-pointer rounded-lg w-fit py-3 mt-7 bg-[#08a88a] text-white px-9"
        >
          Update Profile
        </div>
      </div>
      <Drawer
        title="Update Profile"
        open={profileModal}
        onClose={() => setprofileModal(false)}
        footer={[false]}
        width={720}
      >
        <div className="flex items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center rounded-lg p-5">
            {admin.map((ad) => (
              <div className="items-center justify-center flex flex-col">
                <Image
                  className="rounded-lg w-[150px] h-[150px] object-cover"
                  src={`http://localhost:1000/${ad.photo}`}
                  height={500}
                  width={500}
                  alt="image"
                />
                <p className="flex gap-1 items-center py-2">{ad.name}</p>

                <div className="border-1 border-b border-[#ccc] my-2" />

                <div className="flex items-center gap-5 justify-between">
                  <p className="flex gap-1">
                    <EmailOutlined />
                    {ad.email}
                  </p>

                  <p className="items-center flex gap-1">
                    <PhoneOutlined className="scale-x-[-1] ml-[2px]" />
                    {ad.phone}
                  </p>
                </div>

                <br />

                <p className="flex gap-1">
                  <LocationOnOutlined />
                  {ad.location}
                </p>

                <p className="items-center flex gap-2 mt-2">
                  <MessageOutlined className="scale-x-[-1] ml-[2px]" />
                  {ad.desc}
                </p>
              </div>
            ))}
          </div>

          {/* form */}
          <div className="flex flex-col gap-3 w-[300px]">
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

            <h1 className="text-lg">Bussiness Name</h1>
            <input
              onChange={(e) => setbusinessName(e.target.value)}
              type="text"
              defaultValue={admin[0]?.name}
              placeholder="Bussiness name"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Email</h1>
            <input
              defaultValue={admin[0]?.email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Bussiness name"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3"
            />

            <h1 className="text-lg">Phone</h1>
            <input
              onChange={(e) => setTelephone(e.target.value)}
              defaultValue={admin[0]?.phone}
              type="text"
              placeholder="123-237-1923"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Location</h1>
            <input
              onChange={(e) => setLocation(e.target.value)}
              defaultValue={admin[0]?.location}
              type="text"
              placeholder="Location"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <h1 className="text-lg">Descrption</h1>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              defaultValue={admin[0]?.desc}
              type="text"
              placeholder="Description"
              className="outline-[#08A88A] rounded-lg ring-1 ring-[#ccc] px-3 py-3 "
            />

            <button
              onClick={() => handleUpdate(admin[0]._id)}
              className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white text-center flex items-center justify-center"
            >
              <h1 className="text-center">Save</h1>
            </button>
          </div>
        </div>
      </Drawer>
      <Toaster />
    </div>
  )
}

export default FitnessSettings
