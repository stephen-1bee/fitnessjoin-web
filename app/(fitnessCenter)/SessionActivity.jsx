import { LocalActivityOutlined } from "@mui/icons-material"
import { CategoryOutlined, ArrowRight } from "@mui/icons-material"
import { Popconfirm, Modal, Table, Space, Tag, Form, Input } from "antd"
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import TextArea from "antd/es/input/TextArea"
import moment from "moment"
const { confirm } = Modal

const SessionActivity = () => {
  const [trainerSessionActivity, setTrainerSessionActity] = useState([])
  const [addModal, setaddModal] = useState(false)
  const [fitnessSession, setFitnessSession] = useState([])
  const [fitnessSessionActivity, setFitnessSessionActivity] = useState([])
  const [sessionId, setsessionId] = useState("")
  const [sessionActivityInfo, setSessionActivityInfo] = useState(null)
  const [previewModal, setpreviewModal] = useState(false)

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  //   state for adding session activity
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")

  //   console.log(sessionId)

  const handlePreview = (info) => {
    setSessionActivityInfo(info)
    setpreviewModal(true)
  }

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  // get fitness session activity
  const getSessionActivity = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setFitnessSessionActivity(result.center_session_activity)
          console.log(result.center_session_activity)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get affiliate trainer fitness session activity
  const getTrainerSessionActivity = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/affiliate-trainer/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainerSessionActity(result.trainer)
          console.log(result.trainer)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // add sesison activity
  const handleAddSessionActivity = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        title: title,
        desc: desc,
        session_id: sessionId,
        center_id: storedFitnessId,
        trainer_id: null,
        creator_type: "center",
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
    getSessionActivity()
    getFitnessSession()
    getTrainerSessionActivity()
  }, [])

  //  get fitness session
  const getFitnessSession = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/sessions/center-sessions/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setFitnessSession(result.center_sessions)
          console.log(result.center_sessions[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

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

  const column = [
    {
      title: "Name",
      key: "title",
      datatIndex: "title",
      render: (_, records) => (
        <div>
          <p>{records ? records.title : ""}</p>
        </div>
      ),
    },
    {
      title: "Description",
      key: "desc",
      datatIndex: "desc",
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
            // onCancel={deleteCancel}
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

  const tColumn = [
    {
      title: "From",
      render: (_, record) => (
        <div>
          <p>{record.trainer[0]?.name}</p>
        </div>
      ),
    },
    {
      title: "Name",
      datatIndex: "title",
      key: "title",
      render: (_, record) => (
        <div>
          <p>{record ? record?.title : ""}</p>
        </div>
      ),
    },
    {
      title: "Description",
      datatIndex: "desc",
      key: "desc",
      render: (_, records) => (
        <div>
          <p>{records ? records?.desc : ""}</p>
        </div>
      ),
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
            // onCancel={deleteCancel}
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

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK")
      },
      onCancel() {
        console.log("Cancel")
      },
    })
  }
  return (
    <div>
      <div className="w-full gap-2 items-center flex bg-white p-5 rounded-lg">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <LocalActivityOutlined className="text-white" />
        </div>
        <h1 className="text-2xl ">Session Activity</h1>
      </div>

      <div className="flex items-center">
        <p className=" text-[16px]">Home</p>
        <ArrowRight />
        <p className="font-semibold">Sessions</p>
        <ArrowRight />
        <p className="flex text-[16px] py-2">Session Activity</p>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {fitnessSessionActivity ? fitnessSessionActivity?.length : "0"}
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
        <Table columns={column} dataSource={fitnessSessionActivity} />
      </div>

      {/* my session activities */}
      <div className="mt-10">
        <div className="flex gap-2 my-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {trainerSessionActivity ? trainerSessionActivity?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">
            Affiliate Trainer Session Activities
          </h1>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <Table columns={tColumn} dataSource={trainerSessionActivity} />
        </div>
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
              {fitnessSession?.map((session) => (
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
    </div>
  )
}

export default SessionActivity
