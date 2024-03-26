import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { ArrowRight, ResetTvSharp } from "@mui/icons-material"
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
import TextArea from "antd/es/input/TextArea"
import moment from "moment"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"

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

  // get trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
  }

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
            toast.error(result.msg)
          }
        })
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  console.log(`trainer center id : ${trainer_center_id}`)

  // delete sesison
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
      // : isSession ? "Title not Available" : isSession.title, // Display "Title not found" or "Loading..." based on isSession
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
          <EditOutlined
            onClick={() => setIsEdithModal(true)}
            className="cursor-pointer"
          />
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
            <DeleteOutlined />
          </Popconfirm>
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
    getApprovedSession()
    getPendingSession()
  }, [])

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
          onClick={() => setaddModal(true)}
          className="flex p-3 bg-[#08a88a] text-white items-center justify-center rounded-md gap-2 w-fit cursor-pointer"
        >
          <PlusOutlined />
          <p>Add New Session</p>
        </div>
      </div>

      <Table columns={column} dataSource={approvedSession} />

      <div className="mt-10">
        <div className="flex ga-3 py-4">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow-md">
            <h1 className="">{pendingSession ? pendingSession.length : "0"}</h1>
          </div>
          <h1 className="text-lg font-semibold p-2">Pending Sesisons</h1>
        </div>
        <Table columns={column} dataSource={pendingSession} />
      </div>

      {/* Add Session */}
      <Modal
        title="Add Sessions"
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
    </div>
  )
}

export default Session
