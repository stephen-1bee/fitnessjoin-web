"use client"
import React, { useState, useEffect } from "react"
import { FrownOutlined } from "@ant-design/icons"
import {
  Table,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Popconfirm,
  message,
} from "antd"
import {
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons"

import { Toaster, toast } from "react-hot-toast"
import { ArrowRight, FitnessCenterOutlined } from "@mui/icons-material"

const FitnessTrainers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [trainersData, setTrainersData] = useState([])
  const [searchText, setSearchText] = useState("")
  const [form] = Form.useForm()
  const [loading, setloading] = useState(false)
  const [isViewModal, setisViewModal] = useState(false)
  const [isEdithModal, setIsEdithModal] = useState(false)

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  const deleteConfirm = (e) => {
    console.log(e)
    message.success("Trainer successfully Deleted")
  }

  const deleteCancel = (e) => {
    console.log(e)
  }

  const updateConfirm = (e) => {
    console.log(e)
    message.success("Trainer successfully Updated")
  }

  const updateCancel = (e) => {
    console.log(e)
    message.error("Click on No")
  }

  // get all trainers by center id
  const fetchTrainersData = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/all/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainersData(result.trainers)
          console.log(result)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }
  const [newTrainers, setnewTrainers] = useState([])

  const getNewTrainers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainers/new/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setnewTrainers(result.new_trainers)
          console.log(result.new_trainers)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTrainersData()
    getNewTrainers()
  }, [])

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
    setSearchText(selectedKeys[0])
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText("")
  }

  const searchInput = (
    <Input
      className="p-3 w-full outline-none "
      placeholder="Search name"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onPressEnter={handleSearch}
    />
  )

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [password, setPassword] = useState("")

  // add trainers
  const handleAddTrainer = async () => {
    if (!name || !email || !phone || !location || !password) {
      setloading(false)
      return toast.error("All fields are required")
    }
    try {
      setloading(true)
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        name: name,
        email: email,
        location: location,
        phone: phone,
        center_id: storedFitnessId,
        password: password,
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/trainers/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Trainer added successfully") {
            toast.success(result.msg)
            setloading(false)
            console.log(result)
            fetchTrainersData()
            getNewTrainers()
            setIsModalVisible(false)
          } else {
            toast.error(result.msg)
            setloading(false)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteTrainer = (trainerId) => {
    // Handle trainer deletion here
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/trainers/delete/${trainerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Trainer deleted successfully") {
            toast.success(result.msg)
            console.log(result.msg)
            fetchTrainersData()
            getNewTrainers()
          } else {
            toast.error(result.msg)
          }
          console.log(result)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  //handle trainer acceptance
  const handleToggleAcceptance = (trainerId, isAccepted) => {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = isAccepted
      ? `http://localhost:1000/api/v1/trainers/withdraw/${trainerId}`
      : `http://localhost:1000/api/v1/trainers/accept/${trainerId}`

    fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        fetchTrainersData()
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  const [trainerPreview, settrainerPreview] = useState([])
  const handlePreview = (info) => {
    setisViewModal(true)
    settrainerPreview(info)
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Is Accepted",
      dataIndex: "isAccepted",
      key: "isAccepted",
      render: (isAccepted) => (
        <Tag color={isAccepted ? "green" : "red"}>
          {isAccepted ? "Accepted" : "Not Accepted"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => setIsEdithModal(true)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete the Trainer"
            description="Are you sure to delete Trainer?"
            onConfirm={() => handleDeleteTrainer(record._id)}
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
            className="text-white w-[100px] rounded-full py-3 bg-[#08a88a]"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              handleToggleAcceptance(record._id, record.isAccepted)
            }
          >
            {record.isAccepted ? "Withdraw" : "Accept"}
          </button>
        </Space>
      ),
    },
  ]
  return (
    <main className="min-h-screen">
      <div className="flex items-center gap-2">
        <div className="bg-[#09A889] flex rounded-lg items-center justify-center w-12 h-12">
          <FitnessCenterOutlined color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Trainers</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Trainers
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {trainersData ? trainersData?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">Trainers</h1>
        </div>
        {/* add new trainer */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusOutlined />
          <p>Add New Trainer</p>
        </div>
      </div>

      <div className="lg:flex-row flex-col flex lg:gap-24 gap-10 ">
        <div className="flex flex-col mt-5 w-full">
          <Table columns={columns} dataSource={trainersData} />
        </div>

        <div>
          <div className="bg-white shadow h-[500px] overflow-y-auto py-5 px-10 w-[400px] lg:mt-[18px] rounded-md">
            <h1 className="text-2xl font-semibold mb-2">New Trainers</h1>
            <div className="border-b bg-gray-400 mb-10" />
            {newTrainers?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {newTrainers.map((trainer) => (
                  <div className="flex flex-col gap-4" key={trainer._id}>
                    <div className="flex items-center gap-2">
                      <UserOutlined />
                      <div>
                        {trainer.name}
                        <p className="text-[14px] text-[#818181]">
                          {trainer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-col items-center justify-center">
                <FrownOutlined className="m-auto" />
                <h1>No Trainers signed up today</h1>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add Trainer Modal */}
      <Modal
        title="Add Trainer"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[false]}
      >
        <Form form={form} className="gap-4 flex-col flex">
          <div>
            <h1 className="text-lg">Name</h1>
            <Input onChange={(e) => setName(e.target.value)} className="py-4" />
          </div>

          <div>
            <h1 className="text-lg">Email</h1>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Location</h1>
            <Input
              onChange={(e) => setLocation(e.target.value)}
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
            onClick={() => handleAddTrainer()}
          >
            <h1 className="text-center text-[16px]">
              {loading ? "Adding..." : "Add Trainer"}
            </h1>
          </div>
        </Form>
      </Modal>

      {/*  update trainer modal */}
      <Modal
        title="Update Trainer"
        open={isEdithModal}
        onCancel={() => setIsEdithModal(false)}
        footer={[false]}
      >
        <Form form={form} className="gap-4 flex-col flex">
          <div>
            <h1 className="text-lg">Name</h1>
            <Input
              // onChange={(e) => setName(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Email</h1>
            <Input
              // onChange={(e) => setEmail(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Location</h1>
            <Input
              // onChange={(e) => setLocation(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Phone</h1>
            <Input
              // onChange={(e) => setPhone(e.target.value)}
              className="py-4"
            />
          </div>
          <div>
            <h1 className="text-lg">Password</h1>
            <Input.Password
              // onChange={(e) => setPassword(e.target.value)}
              className="py-4"
            />
          </div>

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            // onClick={() => handleAddTrainer()}
          >
            <h1 className="text-center text-[16px]">
              {loading ? "Updating..." : "Update Trainer"}
            </h1>
          </div>
        </Form>
      </Modal>

      {/* view trainer details */}
      <Modal
        title="Trainer Preview"
        open={isViewModal}
        onCancel={() => setisViewModal(false)}
        footer={false}
      >
        <div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold"> Name:</h1>
            <p>{trainerPreview.name}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Email:</h1>
            <p>{trainerPreview.email}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Location:</h1>
            <p>{trainerPreview.location}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Phone:</h1>
            <p>{trainerPreview.phone}</p>
          </div>
          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Status:</h1>
            <p>
              <Tag color={trainerPreview.isAccepted === true ? "green" : "red"}>
                {trainerPreview.isAccepted === true
                  ? "Accepted"
                  : "Not Accepted"}
              </Tag>
            </p>
          </div>
          <br />
          <div>
            <h1>Date Registered:</h1>
            <p>
              {new Date(trainerPreview.dateCreated).toLocaleDateString()}{" "}
              {new Date(trainerPreview.dateCreated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Modal>
      <Toaster />
    </main>
  )
}

export default FitnessTrainers
