"use client"
import React, { useEffect, useState } from "react"
import { Table, Input, Space, Modal, Form, Popconfirm, Button } from "antd"
import { FrownOutlined } from "@ant-design/icons"
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { toast, Toaster } from "react-hot-toast"
import { ArrowRight, Person2Outlined } from "@mui/icons-material"
import moment from "moment"

const FitnessMembers = () => {
  const [isEdithModal, setIsEdithModal] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModal, setisViewModal] = useState(false)
  const [loading, setloading] = useState(false)

  const deleteCancel = (e) => {
    console.log(e)
  }

  // get all user state
  const [allUsers, setAllUsers] = useState([])

  // add new users state
  const [firstName, setFirst_name] = useState("")
  const [lastName, setLast_name] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [newUsers, setnewUsers] = useState([])

  // update state variables
  const [updateFirstname, setupdateFirstname] = useState("")
  const [updateLastname, setupdateLastname] = useState("")
  const [updateEmail, setupdateEmail] = useState("")
  const [updatePhone, setupdatePhone] = useState("")

  // state to get and populate current user
  const [currentUser, setCurrentUser] = useState(null)

  // state to preview user details
  const [userInfo, setuserInfo] = useState([])

  // populate user
  const populateUser = (info) => {
    setCurrentUser(info)
    setIsEdithModal(true)
  }

  // handle Preview function
  const handlePreview = (info) => {
    setuserInfo(info)
    setisViewModal(true)
  }

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  // add a member
  const addUser = async () => {
    if (!email || !password || !firstName || !phone || !location) {
      return toast.error("All fields are required")
    }
    try {
      setloading(true)
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone: phone,
        center_id: storedFitnessId,
      })

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch("http://localhost:1000/api/v1/users/create", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "user created successfully") {
            toast.success(result.msg)
            console.log(result.msg)
            getAllUsers()
            getNewUsers()
            setloading(false)
            setIsModalVisible(false)
          } else {
            toast.error(result.msg)
            setloading(false)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  const userId = currentUser?._id

  const handleUpdate = async (userId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        first_name: updateFirstname ? updateFirstname : currentUser?.first_name,
        last_name: updateLastname ? updateLastname : currentUser?.last_name,
        email: updateEmail ? updateEmail : currentUser?.email,
        phone: updatePhone ? updatePhone : currentUser?.phone,
        password: currentUser?.password,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/update/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "user updated successfully") {
            toast.success(result.msg)
            console.log(result)
            setIsEdithModal(false)
            getAllUsers()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get all users
  const getAllUsers = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/user/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAllUsers(result.all_users)
          console.log(result.all_users)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // get new user
  const getNewUsers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/new/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setnewUsers(result.new_users)
          getAllUsers()
          console.log(result.new_users)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAllUsers()
    getNewUsers()
  }, [])

  // delete user
  const deleteUser = async (memberId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/delete/${memberId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "user deleted successfully") {
            toast.success(result.msg)
            getAllUsers()
            getNewUsers()
            console.log(result.msg)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // assign trainer
  const assignTrainer = () => {
    alert('About to assign a trainer')
  }

  const columns = [
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
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (date) => formatteDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => populateUser(record)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete the Member"
            description="Are you sure to delete Member?"
            onConfirm={() => deleteUser(record._id)}
            onCancel={deleteCancel}
            okText="Delete"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
          <button className="bg-[#08a88a] px-4 py-1 text-white rounded-full" onClick={() => assignTrainer()}>Assign</button>
        </Space>
      ),
    },
  ]

  return (
    <main>
      <div className="flex gap-2 items-center">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <Person2Outlined color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Clients</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Clients
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">{allUsers ? allUsers?.length : "0"}</h1>
          </div>
          <h1 className="text-2xl font-semibold py-2"> Clients</h1>
        </div>
        {/* add new member */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusOutlined />
          <p>Add New Client</p>
        </div>
      </div>

      <div className="lg:flex-row flex-col flex lg:gap-18 gap-10 ">
        <div className="flex flex-col w-full mt-5">
          <Table columns={columns} dataSource={allUsers} />
        </div>
        <div>
          <div className="bg-white ring-1 ring-[#ccc] shadow h-[500px] overflow-y-auto py-5 px-10 w-[400px] lg:mt-[18px] rounded-md">
            <h1 className="text-2xl font-semibold mb-2">New Users</h1>
            <div className="border-b bg-gray-400 mb-10" />
            {newUsers?.length >= 1 ? (
              <div className="flex flex-col gap-2">
                {newUsers.map((user) => (
                  <div className="flex flex-col gap-4" key={user._id}>
                    <div className="flex items-center gap-2">
                      <UserOutlined />
                      <div>
                        {user.name}
                        <p className="text-[14px] text-[#818181]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-col items-center">
                <FrownOutlined className="m-auto" />
                <h1>No new Users signed up today</h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for add member */}
      {isModalVisible ? (
        <Modal
          loading={isModalVisible}
          title="Add Member"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[false]}
        >
          <Form className="gap-4 flex-col flex">
            <div>
              <h1 className="text-lg">Firstname</h1>
              <Input
                onChange={(e) => setFirst_name(e.target.value)}
                className="py-4"
              />
            </div>

            <div>
              <h1 className="text-lg">Lastname</h1>
              <Input
                onChange={(e) => setLast_name(e.target.value)}
                className="py-4"
              />
            </div>

            <div>
              <h1 className="text-lg">Email</h1>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                className="py-4"
              />
            </div>

            <div>
              <h1 className="text-lg">Phone</h1>
              <Input
                onChange={(e) => setPhone(e.target.value)}
                className="py-4"
              />
            </div>
            <div>
              <h1 className="text-lg">Password</h1>
              <Input.Password
                onChange={(e) => setPassword(e.target.value)}
                className="py-4"
              />
            </div>

            <div
              className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
              onClick={() => addUser()}
            >
              <h1 className="text-center text-[16px]">
                {loading ? "Adding..." : "Add User"}
              </h1>
            </div>
          </Form>
        </Modal>
      ) : null}

      {/* Modal for Update */}
      <Modal
        loading={true}
        title="Update Client"
        open={isEdithModal}
        onCancel={() => setIsEdithModal(false)}
        footer={[false]}
      >
        <Form className="gap-4 flex-col flex">
          <div key={currentUser?._id}>
            <h1 className="text-lg">Firstname</h1>
            <Input
              defaultValue={currentUser?.first_name}
              onChange={(e) => setupdateFirstname(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Lastname</h1>
            <Input
              defaultValue={currentUser?.last_name}
              onChange={(e) => setupdateLastname(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Email</h1>
            <Input
              defaultValue={currentUser?.email}
              onChange={(e) => setupdateEmail(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Phone</h1>
            <Input
              defaultValue={currentUser?.phone}
              onChange={(e) => setupdatePhone(e.target.value)}
              className="py-4"
            />
          </div>

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            onClick={() => handleUpdate(userId)}
          >
            <h1 className="text-center text-[16px]">Update User</h1>
          </div>
        </Form>
      </Modal>

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
            <p>{userInfo.first_name}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Last Name:</h1>
            <p>{userInfo.last_name}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Email:</h1>
            <p>{userInfo.email}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Phone:</h1>
            <p>{userInfo.phone}</p>
          </div>
          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Memberhsip:</h1>
            <p>{userInfo.membership_id}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Goal:</h1>
            <p>{userInfo.goal ? userInfo.goal : "no goal choosen"}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Date Created:</h1>
            <p>{formatteDate(userInfo.dateCreated)}</p>
          </div>
          <br />
        </div>
      </Modal>
      <Toaster />
    </main>
  )
}

export default FitnessMembers
