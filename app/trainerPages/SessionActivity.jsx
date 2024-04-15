"use client"
import { Popconfirm, Modal, Table, Space, Form, Input } from "antd"
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
import { CategoryOutlined, ArrowRight } from "@mui/icons-material"

const SessionActivity = () => {
  const [addModal, setaddModal] = useState(false)
  const [previewModal, setpreviewModal] = useState(false)
  const [sessionActivity, setsessionActivity] = useState([])
  const [sessionActivityInfo, setSessionActivityInfo] = useState(null)
  const [trainerSession, setTrainerSession] = useState([])
  const [trainer, setTrainer] = useState([])
  const [updateModal, setupdateModal] = useState(false)
  const [currentSessionActivity, setcurrentSessionActivity] = useState(null)

  //   state for adding session activity
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")
  const [sessionId, setsessionId] = useState("")

  // states for updating session activity
  const [newTitle, setnewTitle] = useState("")
  const [newDesc, setnewDesc] = useState("")
  const [newSessionId, setnewSessionId] = useState("")

  // console.log(newTitle)
  // console.log(newDesc)
  // console.log(newSessionId)

  const handlePreview = (info) => {
    setSessionActivityInfo(info)
    setpreviewModal(true)
  }

  const populateSessionActivity = (info) => {
    setcurrentSessionActivity(info)
    setupdateModal(true)
  }
  // console.log(sessionId)

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

  // handle delete session activity
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

  // handle update session activity
  const updateSessionActivity = async (activityId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        title: newTitle ? newTitle : currentSessionActivity?.title,
        desc: newDesc ? newDesc : currentSessionActivity?.desc,
        session_id: newSessionId
          ? newSessionId
          : currentSessionActivity.session_id,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/update/${activityId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Activity updated successfully") {
            toast.success(result.msg)
            console.log(result)
            getSessionActivity()
            setupdateModal(false)
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
        `http://localhost:1000/api/v1/sessions/trainer/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainerSession(result.trainer_sessions)
          console.log(result.trainer_sessions)
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

  const openEligibleTrainer = () => {
    if (eligible === false) {
      toast.error(
        "You are not eligible to add Session Activity yet. Please contact the  administrator."
      )
    } else {
      setaddModal(true)
    }
  }

  useEffect(() => {
    gettrainer()
    getTrainerSession()
    getSessionActivity()
  }, [])

  // add sesison activity
  const handleAddSessionActivity = async () => {
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
          <EditOutlined onClick={() => populateSessionActivity(record)} />
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
      <h1 className="text-3xl">Session Activity</h1>
      <p className="flex text-[16px]">
        Home{" "}
        <span>
          <ArrowRight />
        </span>
        Sessions
        <span>
          <ArrowRight />
        </span>
        Session Activity
      </p>
      <div className="flex items-center justify-between py-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow-md">
            <h1 className="">
              {sessionActivity ? sessionActivity?.length : "0"}
            </h1>
          </div>
          <h1 className="text-lg font-semibold p-2">Sessions Activities</h1>
        </div>

        {/* add new activity */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => openEligibleTrainer()}
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
      {/* update modal */}
      <Modal
        title="Update Session Activity"
        open={updateModal}
        onCancel={() => setupdateModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4" key={currentSessionActivity?._id}>
          <div>
            <h1 className="text-lg">Title</h1>
            <Input
              defaultValue={currentSessionActivity?.title}
              onChange={(e) => setnewTitle(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Discription</h1>
            <TextArea
              defaultValue={currentSessionActivity?.desc}
              onChange={(e) => setnewDesc(e.target.value)}
              rows={4}
              placeholder="Description"
            />
          </div>

          <div>
            <h1 className="text-lg">Select a Fitness Session</h1>
            <select
              onChange={(e) => setnewSessionId(e.target.value)}
              className="rounded-md h-12 ring-1 ring-[#ccc] w-full"
            >
              <option value="" defaultValue={currentSessionActivity?.sessionId}>
                Select Session
              </option>
              {trainerSession?.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.title}
                </option>
              ))}
            </select>
            <button
              className="p-3 py-3 bg-[#08a88a] text-white rounded-md w-full mt-5"
              onClick={() => updateSessionActivity(currentSessionActivity?._id)}
            >
              Update Session Activity
            </button>
          </div>
        </Form>
      </Modal>
      <Toaster />
    </div>
  )
}

export default SessionActivity
