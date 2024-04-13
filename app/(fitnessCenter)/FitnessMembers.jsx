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
  const [currentTrainerId, setCurrentTrainerId] = useState("")
  const [centerTrainers, setCenterTrainer] = useState([])
  const [goal, setGoal] = useState([])
  const [goalField, setgoalField] = useState("")

  // logs
  // console.log("Trainer Id: ", currentTrainerId)

  const deleteCancel = (e) => {
    console.log(e)
  }

  // get all users state
  const [allUsers, setAllUsers] = useState([])

  // add new users state variables
  const [firstName, setFirst_name] = useState("")
  const [lastName, setLast_name] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [newUsers, setnewUsers] = useState([])
  const [assignAdding, setAssignAdding] = useState(false)

  // update user state variables
  const [updateFirstname, setupdateFirstname] = useState("")
  const [updateLastname, setupdateLastname] = useState("")
  const [updateEmail, setupdateEmail] = useState("")
  const [updatePhone, setupdatePhone] = useState("")
  const [currentUserId, setCurrentUserId] = useState("")
  const [updateGoalField, setupdateGoalField] = useState("")

  // state to get and populate current user
  const [currentUser, setCurrentUser] = useState(null)
  const [assignModal, setAssignModal] = useState(false)

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

  console.log(allUsers)

  // get center trainers
  const getCenterTrainers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/all/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setCenterTrainer(result.trainers)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // add a member
  const addUser = async () => {
    if (!email || !password || !firstName || !phone) {
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
        goal: goalField,
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

  const getFitnessGoals = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/center/${storedFitnessId}`,
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

  // grab current user id
  const userId = currentUser?._id

  // update user details
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
        goal: updateGoalField ? updateGoalField : currentUser?.goal,
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

  // get fitness center users
  const getAllUsers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/users/all/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAllUsers(result.users)
          console.log(result.users)
        })
        .catch((error) => console.error(error))
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
    getCenterTrainers()
    getFitnessGoals()
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
  const assignTrainer = (user_id) => {
    setAssignModal(true)
    setCurrentUserId(user_id)
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
          <button
            className="bg-[#08a88a] px-4 py-1 text-white rounded-full"
            onClick={() => assignTrainer(record._id)}
          >
            Assign
          </button>
        </Space>
      ),
    },
  ]

  console.log(`user info ${userInfo.name}`)

  // handle assign trainer
  const handleAssignTrainer = async (trainer_id) => {
    try {
      setCurrentTrainerId(trainer_id)
      setAssignAdding(true)
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/assign/${currentUserId}/to/${currentTrainerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAssignAdding(false)
          if (result.msg === "User assigned to trainer successfully") {
            toast.success("User assigned to trainer successfully")
            setAssignModal(false)
          } else {
            setAssignAdding(false)
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
      setCurrentTrainerId(trainer_id)
    } catch (err) {
      console.log(err)
      setAssignAdding(false)
    }
  }

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
          <div className="p-5 bg-white rounded-lg shadow-md">
            <Table columns={columns} dataSource={allUsers} />
          </div>
        </div>
        <div>
          <div className="bg-white ring-1 ring-[#ccc] shadow h-[500px] overflow-y-auto py-4 px-10 w-[400px] lg:mt-[18px] rounded-md">
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

            <div>
              <h1 className="text-lg">Choose a goal</h1>
              <select
                onChange={(e) => setgoalField(e.target.value)}
                className="rounded-md h-12 ring-1 ring-[#ccc] w-full"
              >
                <option value="">Select a goal from this fitness center</option>
                {goal?.map((g) => (
                  <option key={g.goal} value={g.goal}>
                    {g.goal}
                  </option>
                ))}
              </select>
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
        <Form className="gap-4 flex-col flex" key={currentUser?._id}>
          <div>
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

          <div>
            <h1 className="text-lg">Choose a goal</h1>
            <select
              defaultValue={currentUser?.goal}
              onChange={(e) => setupdateGoalField(e.target.value)}
              className="rounded-md h-12 ring-1 ring-[#ccc] w-full"
            >
              <option value="">Select a goal from this fitness center</option>
              {goal?.map((g) => (
                <option key={g.goal} value={g.goal}>
                  {g.goal}
                </option>
              ))}
            </select>
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
            <h1 className="font-bold text-lg">First Name:</h1>
            <p>{userInfo.first_name ? userInfo.first_name : "N/A"}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-lg">Last Name:</h1>
            <p>{userInfo.last_name ? userInfo.last_name : "N/A"}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-lg">Email:</h1>
            <p>{userInfo.email ? userInfo.email : "N/A"}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg">Phone:</h1>
            <p>{userInfo.phone ? userInfo.phone : "N/A"}</p>
          </div>
          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg">Memberhsip:</h1>
            <p>{userInfo.membership_id ? userInfo.membership_id : "N/A"}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg">Goal:</h1>
            <p>{userInfo.goal ? userInfo.goal : "no goal choosen"}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            {/* <h1 className="font-bold text-lg">Trainer:</h1>
            <p>
              {trainer.name ? (
                <div className="flex items-center gap-1 ">
                  <UserOutlined />
                  {trainer.name}
                </div>
              ) : (
                "not assiged to a Trainer yet"
              )}
            </p> */}
            <p>{userInfo.trainer?.name}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg">Date Created:</h1>
            <p>{formatteDate(userInfo.dateCreated)}</p>
          </div>
          <br />
        </div>
      </Modal>

      {/* Assign trainer modal */}
      <Modal
        open={assignModal}
        onCancel={() => setAssignModal(false)}
        className=""
        footer={false}
      >
        <div className="mt-7">
          <select
            className="w-full p-3 rounded-md border-[1px] border-[#ccc] border-dashed outline-none"
            onChange={(e) => setCurrentTrainerId(e.target.value)}
          >
            <option value="" selected disabled>
              Select Trainer
            </option>
            {centerTrainers.map((trainer) => (
              <option value={trainer._id}>{trainer.name}</option>
            ))}
          </select>
          <button
            className="p-3 bg-[#08a88a] text-white rounded-md w-full mt-5"
            onClick={() => handleAssignTrainer()}
          >
            {assignAdding ? "Assigning..." : "Assign Trainer"}
          </button>
        </div>
      </Modal>
      <Toaster />
    </main>
  )
}

export default FitnessMembers
