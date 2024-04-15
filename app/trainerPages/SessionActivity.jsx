"use client"
import { LocalActivityOutlined } from "@mui/icons-material"
import { CategoryOutlined, ArrowRight } from "@mui/icons-material"
import { Popconfirm, Modal, Table, Space, Tag, Form, Input } from "antd"
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import React, { useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"
import TextArea from "antd/es/input/TextArea"
import moment from "moment"

const SessionActivity = () => {
  const [addModal, setaddModal] = useState(false)
  const [previewModal, setpreviewModal] = useState(false)
  const [sessionActivity, setsessionActivity] = useState([])
  const [sessionActivityInfo, setSessionActivityInfo] = useState(null)
  const [trainerSession, setTrainerSession] = useState([])
  const [trainer, setTrainer] = useState([])

  const [sessionId, setsessionId] = useState("")

  //   state for adding session activity
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")

  const handlePreview = (info) => {
    setSessionActivityInfo(info)
    setpreviewModal(true)
  }
  console.log(sessionId)

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  // get trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
    trainer_id = sessionStorage.getItem("trainerId")
  }

  //   get trainer
  const gettrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
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

  // handle delete session
  const handleDeleteSessionActivity = async (activityId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/delete/${activityId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "session activity deleted successfully") {
            toast.success(result.msg)
            console.log(result)
            getSessionActivity()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const eligible = trainer.isAccepted

  // get affiliate trainer sessions
  const getTrainerSession = async () => {
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
          setTrainerSession(result.approved_sessions)
          console.log(result.approved_sessions)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const getSessionActivity = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/trainer/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setsessionActivity(result.trainer_session_activity)
          console.log(result.trainer_session_activity)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // add sesison activity
  const handleAddSessionActivity = async () => {
    if (eligible === false) {
      return toast.error(
        "You are not eligible to add Nutrition yet. Please contact the  administrator."
      )
    }
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        title: title,
        desc: desc,
        session_id: sessionId,
        center_id: trainer_center_id,
        trainer_id: trainer_id,
        creator_type: "trainer",
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/session-activity/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "session activity created successfully") {
            toast.success(result.msg)
            console.log(result)
            setaddModal(false)
            getSessionActivity()
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
    gettrainer()
    getTrainerSession()
    getSessionActivity()
  }, [])

  const columns = [
    {
      title: "Title",
      datatIndex: "title",
      key: "title",
      render: (_, records) => <div>{records ? records?.title : ""}</div>,
    },
    {
      title: "Description",
      datatIndex: "desc",
      key: "desc",
      render: (_, records) => <div>{records ? records?.desc : ""}</div>,
    },
    {
      title: "Date Created",
      dataIndex: "deteCreated",
      key: "deteCreated",
      render: (time) => formatteDate(time),
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
            description="Are you sure to Activity Session?"
            onConfirm={() => handleDeleteSessionActivity(record._id)}
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
  return (
    <div>
      {" "}
      <div className="w-full gap-2 items-center flex bg-white p-5 rounded-lg">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <LocalActivityOutlined className="text-white" />
        </div>
        <h1 className="text-2xl ">My Session Activities</h1>
      </div>
      <div className="flex items-center justify-between py-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {sessionActivity ? sessionActivity?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">My Session Activities</h1>
        </div>

        {/* add new activity */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setaddModal(true)}
        >
          <PlusOutlined />
          <p>Add Session Activity</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <Table columns={columns} dataSource={sessionActivity} />
      </div>
      {/* add session activity modal */}
      <Modal
        title="Add Session"
        open={addModal}
        onCancel={() => setaddModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg">Title</h1>
            <Input
              onChange={(e) => settitle(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Discription</h1>
            <TextArea
              onChange={(e) => setdesc(e.target.value)}
              rows={4}
              placeholder="Description"
            />
          </div>

          <div>
            <h1 className="text-lg">Select a Fitness Session</h1>
            <select
              onChange={(e) => setsessionId(e.target.value)}
              className="rounded-md h-12 ring-1 ring-[#ccc] w-full"
            >
              <option value="">Select Session</option>
              {trainerSession?.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.title}
                </option>
              ))}
            </select>
            <button
              className="p-3 py-3 bg-[#08a88a] text-white rounded-md w-full mt-5"
              onClick={() => handleAddSessionActivity()}
            >
              Add Session Activity
            </button>
          </div>
        </Form>
      </Modal>
      {/* preview modal */}
      <Modal
        open={previewModal}
        onCancel={() => setpreviewModal(false)}
        footer={[false]}
        centered
      >
        <div className="flex flex-col gap-1" key={sessionActivityInfo?._id}>
          <h1 className="text-xl">Session Activity Preview</h1>
          <div className="flex flex-col gap-5">
            <h1>Title</h1>
            <p>{sessionActivityInfo?.title}</p>

            <h1>Description</h1>
            <p>{sessionActivityInfo?.desc}</p>

            <h1>Date Created</h1>
            <p>{sessionActivityInfo?.dateCreated}</p>
          </div>
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}

export default SessionActivity
