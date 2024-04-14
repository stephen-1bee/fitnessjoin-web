"use client"
import {
  DeleteOutlineOutlined,
  NotificationsNoneOutlined,
} from "@mui/icons-material"
import { DeleteOutlined, FrownOutlined, UserOutlined } from "@ant-design/icons"
import { Dropdown, Popconfirm, Avatar } from "antd"
import React, { useState, useEffect } from "react"
import moment from "moment"
import toast, { Toaster } from "react-hot-toast"
import { SettingsOutlined } from "@mui/icons-material"
import MenuItem from "antd/es/menu/MenuItem"

const CenterNav = ({ setActiveItem, activeItem }) => {
  const [notification, setNotification] = useState([])
  const [admin, setAdmin] = useState([])

  const formattDate = (date) => {
    return moment(date).format("MMM dd, yyyy")
  }

  // retrive center name and Id through session
  let center_id
  let name
  let notificationOpened
  if (typeof sessionStorage !== "undefined") {
    name = sessionStorage.getItem("centerName")
    notificationOpened = sessionStorage.getItem("notification")
    center_id = sessionStorage.getItem("fitnessCenterId")
  }

  const handleAdmin = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/one/${center_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAdmin(result.admin)
          console.log(result.admin)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get notification api
  const getNotification = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      }

      let response = await fetch(
        `http://localhost:1000/api/v1/activities/center/${center_id}`,
        {
          method: "GET",
          headers: headersList,
        }
      )

      let data = await response.json()
      setNotification(data.activity)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteNotification = (notificationId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/activities/delete/${notificationId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification deleted successfully") {
            toast.success(result.msg)
            getNotification()
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
    getNotification()
    handleAdmin()
  }, [])

  // logout popup
  const logout = [
    {
      key: "1",
      label: (
        <div className="flex flex-col gap-3 w-[150px] items-center justify-center">
          <Popconfirm
            placement="top"
            title={"Logout"}
            description={"Do you want logout?"}
            okText="Yes"
            okButtonProps={{ style: { backgroundColor: "red" } }}
            onConfirm={() => (window.location.href = "/adminLogin")}
            cancelText="No"
          >
            <button>Logout</button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // // set active item in session
  // useEffect(() => {
  //   const storedActiveItem = sessionStorage.getItem("activeItem")
  //   if (storedActiveItem) {
  //     setActiveItem(storedActiveItem)
  //   }
  // }, [setActiveItem])

  // const handleItemClick = (item) => {
  //   setActiveItem(item)
  //   sessionStorage.setItem("activeItem", item)
  // }

  //notificaton ui
  const notificationUi = (
    <div className="p-5">
      <div className="w-[450px] h-[500px] shadow-md flex py-5 flex-col items-center bg-[#fdf9f0] justify-center rounded-lg overflow-y-auto">
        {notificationOpened === "false" ? (
          ""
        ) : (
          <div className="flex flex-col w-full px-5">
            <div className="flex items-center justify-between py-2 mt-2 ">
              <h1 className="text-xl font-semibold">Notifications</h1>
              <SettingsOutlined />
            </div>
            <div className="w-full border-gray-200 border-[0.1px]" />
          </div>
        )}
        {notification?.length > 0 ? (
          <div>
            {notificationOpened === "true" ? (
              <div className="p-4">
                {notification.map((notice) => (
                  <div className="border-b border-[#ededed] pb-2 pt-2 flex items-center justify-between">
                    <div className="flex gap-2 items-center ">
                      <div className=" w-[5px] h-[5px] bg-blue-600 rounded-full" />
                      <p>{notice.message}</p>
                    </div>

                    <div className="flex flex-col gap-1 items-end ml-2">
                      <p className="text-[10px]">
                        {formattDate(notice.dateCreated)}
                      </p>
                      <Popconfirm
                        title="Delete Feedback"
                        description="Are you sure to delete Feedback?"
                        okText="Delete"
                        onConfirm={() => deleteNotification(notice._id)}
                        cancelText="No"
                        okButtonProps={{
                          style: { backgroundColor: "red", color: "white" },
                        }}
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 mt-5">
                <FrownOutlined />
                <p>notification has been turned off</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 mt-5">
            <FrownOutlined />
            <p>No Notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center h-[12vh] lg:pl-[750px] md:pl-[450px] pl-[40px] w-full bg-[#fdf9f0] gap-2 fixed z-[999]">
      {/* fitness name */}
      <h1>{name ? name : ""}</h1>

      {/* notification */}
      <Dropdown
        className="cursor-pointer"
        overlay={notificationUi}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <NotificationsNoneOutlined />
      </Dropdown>

      {/*logout  */}
      <Dropdown
        trigger={["click"]}
        menu={{ items: logout }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <Avatar
          className="items-center justify-center cursor-pointer"
          style={{ backgroundColor: "#7265e6" }}
          icon={<UserOutlined />}
        />
      </Dropdown>
      <Toaster />
    </div>
  )
}

export default CenterNav
