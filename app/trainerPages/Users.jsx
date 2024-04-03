"use client"
import { DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Table, Space, Popconfirm, Modal } from "antd"
import React, { useState, useEffect } from "react"
import moment from "moment"

const Users = () => {
  const [users, setusers] = useState([])
  const [preview, setpreview] = useState(null)
  const [isViewModal, setisViewModal] = useState(false)

  const previewUser = (info) => {
    setpreview(info)
    setisViewModal(true)
  }

  let trainer_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
  }

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  const getUsers = () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/users/users/byTrainer/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setusers(result.users)
          console.log(result.users)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const column = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined onClick={() => previewUser(record)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-3xl">Assigned Users</h1>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Users
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1>{users.length}</h1>
        </div>
      </div>
      <Table columns={column} dataSource={users} />

      {/* Preview Modal */}
      <Modal
        title="User Preview"
        open={isViewModal}
        onCancel={() => setisViewModal(false)}
        footer={false}
      >
        <div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">First Name:</h1>
            <p>{preview?.first_name}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Last Name:</h1>
            <p>{preview?.last_name}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Email:</h1>
            <p>{preview?.email}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Phone:</h1>
            <p>{preview?.phone}</p>
          </div>
          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Memberhsip:</h1>
            <p>{preview?.membership_id}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Goal:</h1>
            <p>{preview?.goal ? userInfo.goal : "no goal choosen"}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Date Created:</h1>
            <p>{formatteDate(preview?.dateCreated)}</p>
          </div>
          <br />
        </div>
      </Modal>
    </div>
  )
}

export default Users
