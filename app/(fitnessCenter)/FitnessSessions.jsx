import React, { useState } from "react"
import {
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Table,
  Upload,
  Space,
  Tag,
} from "antd"
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import moment from "moment"
import { CategoryOutlined, ArrowRight } from "@mui/icons-material"
import TextArea from "antd/es/input/TextArea"
import { useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"

const FitnessSessions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [trainerSession, setTrainerSession] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTIme, setEndTime] = useState("")

  const [isEdithModal, setIsEdithModal] = useState(false)
  const [loading, setloading] = useState(false)
  const [allSession, setAllSessions] = useState([])

  // format date function
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }
  // format time
  const formattedTime = (time) => {
    return moment(time, "HH:mm:ss").format("hh:mm A")
  }

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  // handle preview

  const handleDelete = async (sessionid) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/sessions/delete/${sessionid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "session deleted successfully") {
            toast.success(result.msg)
            getAllSessions()
            getTrainerSession()
          } else {
            toast.error(result.msg)
          }
          console.log(result)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const updateConfirm = (e) => {
    console.log(e)
    message.success("Session Plan successfully Updated")
  }

  // const searchInput = (
  //   <Input.Search className="w-[300px]" placeholder="Search name" />
  // );

  const handleCancel = (e) => {
    // Handle cancel logic if needed
  }

  const addSession = async () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTIme
    ) {
      return toast.error("All field are required")
    }
    try {
      setloading(true)
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        title: title,
        description: description,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTIme,
        center_id: storedFitnessId,
        isApproved: true,
        creator_type: "center",
      })

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/sessions/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "session added successfully") {
            toast.success(result.msg)
            getAllSessions()
            setloading(false)
            console.log(result)
            setIsModalVisible(false)
          } else {
            toast.error(result.msg)
          }
        })
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  // get all sessions by center id
  const getAllSessions = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/sessions/center-sessions/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAllSessions(result.center)
          console.log(result.center[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const getTrainerSession = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/sessions/trainer-sessions/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainerSession(result.trainer)
          console.log(result.trainer)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllSessions()
    getTrainerSession()
  }, [])

  const [preview, setpreview] = useState([])
  const [isViewModal, setisViewModal] = useState(false)
  const handlePreview = (info) => {
    setisViewModal(true)
    setpreview(info)
  }
  const deleteCancel = (e) => {
    console.log(e)
  }

  const handleToggleAcceptance = (sessionId, isApproved) => {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = isApproved
      ? `http://localhost:1000/api/v1/sessions/disapprove/${sessionId}`
      : `http://localhost:1000/api/v1/sessions/approve/${sessionId}`

    fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        getTrainerSession()
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      key: "food",
      render: (title) =>
        title ? title : isSession ? "Title not Available" : isSession.title, // Display "Title not found" or "Loading..." based on isSession
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start date ",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => formatteDate(date),
    },
    {
      title: "End date ",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => formatteDate(date),
    },
    {
      title: "Start Time ",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => formattedTime(time),
    },
    {
      title: "End Time ",
      dataIndex: "end_time",
      key: "end_time",
      render: (time) => formattedTime(time),
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (record) => (
        <Tag color={record ? "green" : "red"}>
          {record ? "approved" : "not-approved"}
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
            title="Delete the Session"
            description="Are you sure to delete session?"
            onConfirm={() => handleDelete(record._id)}
            onCancel={deleteCancel}
            okText="Delete"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const columnT = [
    {
      title: "From",
      render: (_, record) => (
        <div>
          <p>{record.trainer[0]?.name}</p>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "food",
      render: (title) =>
        title ? title : isSession ? "Title not Available" : isSession.title, // Display "Title not found" or "Loading..." based on isSession
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start date ",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => formatteDate(date),
    },
    {
      title: "End date ",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => formatteDate(date),
    },
    {
      title: "Start Time ",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => formattedTime(time),
    },
    {
      title: "End Time ",
      dataIndex: "end_time",
      key: "end_time",
      render: (time) => formattedTime(time),
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (record) => (
        <Tag color={record ? "green" : "red"}>
          {record ? "approved" : "pending"}
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
            description="Are you sure to delete Trainer's Session?"
            onConfirm={() => handleDelete(record._id)}
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
              handleToggleAcceptance(record._id, record.isApproved)
            }
          >
            {record.isApproved ? "Withdraw" : "Approve"}
          </button>
        </Space>
      ),
    },
  ]

  return (
    <div className="min-h-screen gap-5 ">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <CategoryOutlined color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Sessions</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        <h1 className="font-semibold">Sessions</h1>
        {/* <p>{trainerSession.map((t) => t.trainer)}</p> */}
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">{allSession ? allSession?.length : "0"}</h1>
          </div>
          <h1 className="text-2xl  py-2">My Sessions</h1>
        </div>
        {/* add new Session */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusOutlined />
          <h1>Add New Session</h1>
        </div>
      </div>

      {/* <Form className=" outline-none p-5">{searchInput}</Form> */}

      <div className="flex gap-10">
        {/* <div className="flex gap-5 mt-[50px] mr-[700px]  w-[250px] shadow hover:shadow-2xl transition-all duration-300 cursor-pointer rounded-lg">
          <div className="flex items-center justify-between flex-col  w-[content]">
            <Image
              className="rounded-lg"
              width={400}
              height={400}
              alt="Image"
              src="/city.jpg"
            />
            <div className="flex mr-10 mt-2  flex-col gap-1">
              <h1 className="font-bold text-lg mb-4 mt-1">{session.title}</h1>
              <h1 className="text-gray-600">{session.desc}</h1>
              <div className="flex gap-2">
                <h1 className="text-gray-600">{session.startTime} - </h1>
                <h1 className="text-gray-600">{session.endTime}</h1>
              </div>
              <div className="flex gap-2">
                <h1 className="text-gray-600">{session.startDate} - </h1>
                <h1 className="text-gray-600">{session.endDate} </h1>
              </div>
              <hr className="bg-black mb-1 mt-2" />
              <div className="flex mb-2 gap-2 mt-2 items-center">
                <CreateOutlinedIcon className="text-[#818181] text-[22px]" />
                <EyeOutlined className="text-[#818181]" />
                <Popconfirm
                  className="border-none text-[#818181]"
                  title="Delete"
                  description="Do you want to delete this Article?"
                  onConfirm={handleConfirm} // Renamed from confirm
                  onCancel={handleCancel}
                  okText="Yes"
                  cancelText="No"
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: "red",
                      }}
                    />
                  }
                >
                  <DeleteOutline />
                </Popconfirm>
              </div>
            </div>
          </div>
          
        </div> */}
      </div>

      {/* Table */}
      <Table columns={column} dataSource={allSession} />
      <div className="flex gap-2 py-3">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1 className="text-lg">
            {trainerSession ? trainerSession?.length : "0"}
          </h1>
        </div>
        <h1 className="text-2xl  py-2">Affiliate Trainer Sessions</h1>
      </div>

      <Table columns={columnT} dataSource={trainerSession} />
      {isModalVisible ? (
        <Modal
          title="Add Session"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[false]}
        >
          <Form className="flex flex-col gap-4">
            <div>
              <h1 className="text-lg">Name</h1>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                className="py-4"
              />
            </div>

            <div>
              <h1 className="text-lg">Discription</h1>
              <TextArea
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Description"
              />
            </div>

            <h1 className="text-lg">Start Date</h1>
            <DatePicker
              className="py-4"
              onChange={(date, dateString) => setStartDate(dateString)}
            />

            <h1 className="text-lg">End Date</h1>
            <DatePicker
              className="py-4"
              onChange={(date, dateString) => setEndDate(dateString)}
            />

            <h1 className="text-lg">Start TIme</h1>
            <TimePicker
              className="py-4"
              onChange={(time, timeString) => setStartTime(timeString)}
            />

            <h1 className="text-lg">End Time</h1>
            <TimePicker
              className="py-4"
              onChange={(time, timeString) => setEndTime(timeString)} // Use timeString for time input
            />

            <div
              className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
              onClick={() => addSession()}
            >
              <h1 className="text-center">
                {loading ? "Adding..." : "Add Session"}
              </h1>
            </div>
          </Form>
        </Modal>
      ) : null}
      <Toaster />

      {/* update modal */}
      <Modal
        title="Update Sessions"
        open={isEdithModal}
        onCancel={() => setIsEdithModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg">Name</h1>
            <Input
              // onChange={(e) => (e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Discription</h1>
            <TextArea
              // onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Description"
            />
          </div>

          <h1 className="text-lg">Start Date</h1>
          <DatePicker
            className="py-4"
            // onChange={(date, dateString) => setStartDate(dateString)}
          />

          <h1 className="text-lg">End Date</h1>
          <DatePicker
            className="py-4"
            // onChange={(date, dateString) => setEndDate(dateString)}
          />

          <h1 className="text-lg">Start TIme</h1>
          <TimePicker
            className="py-4"
            // onChange={(time, timeString) => setStartTime(timeString)}
          />

          <h1 className="text-lg">End Time</h1>
          <TimePicker
            className="py-4"
            // onChange={(time, timeString) => setEndTime(timeString)}
          />

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            // onClick={() => addSession()}
          >
            <h1 className="text-center">
              {loading ? "Updating..." : "Update Session"}
            </h1>
          </div>
        </Form>
      </Modal>

      {/* Preview modal */}
      <Modal
        title="Session Preview"
        open={isViewModal}
        footer={false}
        onCancel={() => setisViewModal(false)}
      >
        <div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Session Name</h1>
            <p>{preview.title}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Description</h1>
            <p>{preview.description}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Start-Time:</h1>
            <p>{formattedTime(preview.start_time)}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">End-Time:</h1>
            <p>{formattedTime(preview.end_time)}</p>
          </div>
          <br />
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Start-Date:</h1>
            <p>{formatteDate(preview.start_date)}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">End-Date:</h1>
            <p>{formatteDate(preview.end_date)}</p>
          </div>
          <br />
        </div>
      </Modal>
    </div>
  )
}

export default FitnessSessions
