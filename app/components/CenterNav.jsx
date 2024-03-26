"use client"
import { NotificationsNoneOutlined } from "@mui/icons-material"
import { FrownOutlined, UserOutlined } from "@ant-design/icons"
import { Dropdown, Popconfirm, Avatar } from "antd"
import React, { useState, useEffect } from "react"

const CenterNav = () => {
  const [notification, setNotification] = useState([])
  const [admin, setAdmin] = useState([])

  // retrive center name and Id through session
  let center_id
  let name
  if (typeof sessionStorage !== "undefined") {
    name = sessionStorage.getItem("centerName")
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
  const getNotification = async (req, res) => {
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

  useEffect(() => {
    getNotification()
    handleAdmin()
  }, [])

  // logout popup
  const logout = [
    {
      key: "1",
      label: (
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
      ),
    },
  ]

  //notificaton ui
  const notificationUi = (
    <div className="p-5">
      <div className="w-[300px] shadow-md py-6 flex flex-col items-center bg-[#fdf9f0] justify-center rounded-lg">
        <h1 className="text-xl font-semibold">Notifications</h1>
        {notification.length > 0 ? (
          <div className="flex flex-col gap-5 px-5">
            {notification.map((notice) => (
              <div>
                {/* <h1>From: {notice.center.name} </h1> */}
                <div className="flex gap-2 items-center ">
                  <div className=" w-[5px] h-[5px] bg-blue-600 rounded-full " />
                  <p>{notice.message}</p>
                </div>
                <div className="border-b mt-1" />
              </div>
            ))}
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
    </div>
  )
}

export default CenterNav
