import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FrownOutlined,
} from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
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
import TextArea from "antd/es/input/TextArea"
import moment from "moment"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

const Session = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setloading] = useState(false)
  const [addModal, setaddModal] = useState(false)
  const [pendingSession, setPendingSession] = useState([])
  const [approvedSession, setApprovedSession] = useState([])
  const [trainer, setTrainer] = useState([])
  const [isViewModal, setisViewModal] = useState(false)
  const [isEdithModal, setIsEdithModal] = useState(false)
  const [preview, setpreview] = useState([])
  const [viewActivities, setviewActivities] = useState(false)
  const [sessionActivity, setsessionActivity] = useState([])

  // state for update fields
  const [newTitle, setnewTitle] = useState("")
  const [newDesc, setnewDesc] = useState("")
  const [newStartDate, setnewStartDate] = useState("")
  const [newEndDate, setnewEndDate] = useState("")
  const [newStartTime, setnewStartTime] = useState("")
  const [newEndTime, setnewEndTime] = useState("")

  const populateSessionActivity = (info) => {
    setviewActivities(true)
    setsessionActivity(info)
  }

  console.log(sessionActivity)

  // get trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
  }

  // state to hold current session
  const [currentSession, setcurrentSession] = useState(null)

  // function to populate session update field
  const populateSession = (info) => {
    setcurrentSession(info)
    setIsEdithModal(true)
  }

  const currentSessionId = currentSession?._id

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
            getApprovedSession()
            getPendingSession()
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

  const gettrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/trainers/one/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainer(result.trainer[0])
          // console.log(result.trainer[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const eligible = trainer.isAccepted

  // handle add session
  const addSession = async () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !startDate ||
      !endTime
    ) {
      return toast.error("All fields are required")
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
        center_id: trainer_center_id,
        trainer_id: trainer_id,
        isApproved: false,
        creator_type: "trainer",
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
            getPendingSession()
            setloading(false)
            console.log(result)
            setaddModal(false)
          } else {
            setloading(false)
            toast.error(result.msg)
          }
        })
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  const hanldeOpenModel = () => {
    if (eligible === false) {
      return toast.error(
        "You are not eligible to add Sessions yet. Please contact the  administrator."
      )
    }
    setaddModal(true)
  }

  // delete sesison
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
            getApprovedSession()
            getPendingSession()
          } else {
            toast.error(result.msg)
          }
          console.log(result)
        })
    } catch (err) {
      console.log(err)
    }
  }

  // format date function
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }
  // format time
  const formattedTime = (time) => {
    return moment(time, "HH:mm:ss").format("hh:mm A")
  }

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      key: "food",
      render: (title) => (title ? title : "no title"),
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
          {record ? "active" : "pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {eligible === false ? (
            ""
          ) : (
            <EditOutlined
              className="cursor-pointer"
              onClick={() => populateSession(record)}
            />
          )}
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete the Session"
            description="Are you sure to delete Session?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          >
            {eligible === false ? (
              ""
            ) : (
              <div>
                <DeleteOutlined />
              </div>
            )}
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

  // get pending sessions
  const getPendingSession = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/sessions/pending/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setPendingSession(result.pending_sessions)
          console.log(result.pending_sessions)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get approved session
  const getApprovedSession = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/sessions/approved/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setApprovedSession(result.approved_sessions)
          console.log(result.approved_sessions)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    gettrainer()
    getApprovedSession()
    getPendingSession()
  }, [])

  const handlePreview = (info) => {
    setisViewModal(true)
    setpreview(info)
  }

  return (
    <div>
      <h1 className="text-3xl">Sessions</h1>
      <p className="flex text-[16px]">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Sessions
      </p>
      <div className="flex items-center justify-between py-5">
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow-md">
            <h1 className="">
              {approvedSession ? approvedSession?.length : "0"}
            </h1>
          </div>
          <h1 className="text-lg font-semibold p-2">Approved Sesisons</h1>
        </div>
        {/* add new session */}
        <div
          onClick={() => hanldeOpenModel(true)}
          className="flex p-3 bg-[#08a88a] text-white items-center justify-center rounded-md gap-2 w-fit cursor-pointer"
        >
          <PlusOutlined />
          <p>Add New Session</p>
        </div>
      </div>

      <div className="p-5 bg-white showdow-md rounded-lg">
        <Table columns={column} dataSource={approvedSession} />
      </div>

      <div className="mt-10">
        <div className="flex ga-3 py-4">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow-md">
            <h1 className="">{pendingSession ? pendingSession.length : "0"}</h1>
          </div>
          <h1 className="text-lg font-semibold p-2">Pending Sesisons</h1>
        </div>
        <div className="p-5 bg-white showdow-md rounded-lg">
          <Table columns={column} dataSource={pendingSession} />
        </div>
      </div>

      {/* Add Session */}
      <Modal
        title="Add Session Session"
        open={addModal}
        onCancel={() => setaddModal(false)}
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

      {/* update modal */}
      <Modal
        title="Update Session"
        open={isEdithModal}
        onCancel={() => setIsEdithModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4" key={currentSession?._id}>
          <div>
            <h1 className="text-lg">Name</h1>
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
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Date Created:</h1>
            <p>{formatteDate(preview.dateCreated)}</p>
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
        <h1 className="text-xl">Activities</h1>
        <div>
          {sessionActivity?.activties?.length > 0 ? (
            <div className="flex flex-col gap-6">
              {sessionActivity?.activties?.map((activity) => (
                <div className="flex  bg-white border-b-[2px] border-b-[#ccc] border-dashed pb-4 flex-col p-2 gap-3">
                  <h2 className="text-lg">{activity.title}</h2>
                  <p>{activity.desc}</p>
                  {/* <p>
                    {activity.status === "true" ? (
                      <div className="bg-[#caffe2]">
                        <p color="green">Completed</p>
                      </div>
                    ) : (
                      <div className="bg-[#f7ecea] p-2">
                        <p className="text-[black]">Incomplete</p>
                      </div>
                    )}
                  </p> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center justrify-center ">
              <FrownOutlined />
              No session Activity
            </div>
          )}
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}

export default Session
