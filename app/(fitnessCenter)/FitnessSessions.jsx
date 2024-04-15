import React, { useState } from "react"
import {
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Table,
  Space,
  Tag,
} from "antd"
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
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
  const [endTime, setEndTime] = useState("")
  const [viewActivities, setviewActivities] = useState(false)
  const [sessionActivity, setsessionActivity] = useState([])

  // state for update fields
  const [newTitle, setnewTitle] = useState("")
  const [newDesc, setnewDesc] = useState("")
  const [newStartDate, setnewStartDate] = useState("")
  const [newEndDate, setnewEndDate] = useState("")
  const [newStartTime, setnewStartTime] = useState("")
  const [newEndTime, setnewEndTime] = useState("")

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

  // state to hold current session
  const [currentSession, setcurrentSession] = useState(null)

  // function to populate session update field
  const populateSession = (info) => {
    setcurrentSession(info)
    setIsEdithModal(true)
  }

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  // handle delete session
  const handleDelete = async (sessionid) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
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

  // handle add session
  const addSession = async () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime
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
        end_time: endTime,
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
          setAllSessions(result.center_sessions)
          console.log(result.center_sessions[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get affiliate trainer sessions
  const getTrainerSession = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
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
  const currentSessionId = currentSession?._id
  // update api
  const handleUpdateSession = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        title: newTitle ? newTitle : currentSession.title,
        description: newDesc ? newDesc : currentSession.description,
        start_date: newStartDate ? newStartDate : currentSession.start_date,
        end_date: newEndDate ? newEndDate : currentSession.end_date,
        start_time: newStartTime ? newStartTime : currentSession.start_time,
        end_time: newEndTime ? newEndTime : currentSession.end_time,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/sessions/update/${currentSessionId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "session updated successfully") {
            toast.success(result.msg)
            console.log(result)
            getAllSessions()
            getTrainerSession()
            setIsEdithModal(false)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const populateSessionActivity = (info) => {
    setviewActivities(true)
    setsessionActivity(info)
  }

  console.log(sessionActivity)

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
          <EditOutlined onClick={() => populateSession(record)} />
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
          <button
            onClick={() => populateSessionActivity(record)}
            className="border rounded-lg p-2 border-dotted border-gray-400"
          >
            Activities
          </button>
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
          <EditOutlined onClick={() => populateSession(record)} />
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
      <div className="flex gap-2 items-center bg-white w-full py-5 px-5 shadow rounded-lg">
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

      {/* Table */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <Table columns={column} dataSource={allSession} />
      </div>
      <div className="flex gap-2 py-3">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1 className="text-lg">
            {trainerSession ? trainerSession?.length : "0"}
          </h1>
        </div>
        <h1 className="text-2xl  py-2">Affiliate Trainer Sessions</h1>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md">
        <Table columns={columnT} dataSource={trainerSession} />
      </div>
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
        title="Update Session"
        open={isEdithModal}
        onCancel={() => setIsEdithModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg">Title</h1>
            <Input
              defaultValue={currentSession?.title}
              onChange={(e) => setnewTitle(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Description</h1>
            <TextArea
              defaultValue={currentSession?.description}
              onChange={(e) => setnewDesc(e.target.value)}
              rows={4}
              placeholder="Description"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg">Start Date</h1>
            {/* <p>{formatteDate(currentSession?.start_date)} </p> */}
            <DatePicker
              defaultValue={
                currentSession?.start_date
                  ? moment(currentSession?.start_date, "YYYY-MM-DD")
                  : null
              }
              className="py-4"
              onChange={(date, dateString) => setnewStartDate(dateString)}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg">End Date</h1>
            {/* <h1>{formatteDate(currentSession?.end_date)} </h1> */}
            <DatePicker
              defaultValue={
                currentSession?.start_date
                  ? moment(currentSession?.start_date, "YYYY-MM-DD")
                  : null
              }
              className="py-4"
              onChange={(date, dateString) => setnewEndDate(dateString)}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg">Start Time</h1>
            <h1>{formattedTime(currentSession?.start_time)}</h1>
            <TimePicker
              // defaultValue={moment(currentSession?.start_time).format(
              //   "HH:mm:ss"
              // )}
              className="py-4"
              onChange={(time, timeString) => setnewStartTime(timeString)}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg">End Time</h1>
            <h1>{formattedTime(currentSession?.end_time)}</h1>
            <TimePicker
              className="py-4"
              onChange={(time, timeString) => setnewEndTime(timeString)}
            />
          </div>

          <button
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            onClick={() => handleUpdateSession(currentSessionId)}
          >
            <h1 className="text-center">Update Session</h1>
          </button>
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
          <div className="border-b border-[#ccc] border-1 mt-2 " />
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Description</h1>
            <p>{preview.description}</p>
          </div>
          <div className="border-b border-[#ccc] border-1 mt-2 " />
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Start-Time:</h1>
            <p>{formattedTime(preview.start_time)}</p>
          </div>
          <div className="border-b border-[#ccc] border-1 mt-2 " />
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">End-Time:</h1>
            <p>{formattedTime(preview.end_time)}</p>
          </div>
          <div className="border-b border-[#ccc] border-1 mt-2 " />
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Start-Date:</h1>
            <p>{formatteDate(preview.start_date)}</p>
          </div>
          <div className="border-b border-[#ccc] border-1 mt-2 " />
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">End-Date:</h1>
            <p>{formatteDate(preview.end_date)}</p>
          </div>
          <div className="border-b border-[#ccc] border-[0.2px] mt-2 " />
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Date Created:</h1>
            <p>{formatteDate(preview.dateCreated)}</p>
          </div>
          <div className="border-b border-[#ccc] border-1 mt-2 " />

          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Date Updated:</h1>
            <p>{formatteDate(preview.dateUpdated)}</p>
          </div>

          <br />
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Status:</h1>
            <p>
              <Tag color={preview.isApproved === true ? "green" : "red"}>
                {preview.isApproved === true ? "Active" : "Pending"}
              </Tag>
            </p>
          </div>
        </div>
      </Modal>

      {/* view session activities */}
      <Modal
        open={viewActivities}
        onCancel={() => setviewActivities(false)}
        footer={[false]}
        centered
      >
        {/* <div>
          <h1 className="text-xl">Activities</h1>
          <p>
            {sessionActivity.activties.map((activity) => (
              <div>
                <p>{activity.title}</p>
              </div>
            ))}
          </p>
        </div> */}
      </Modal>
    </div>
  )
}

export default FitnessSessions
