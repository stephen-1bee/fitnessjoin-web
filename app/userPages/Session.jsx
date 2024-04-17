"use client"
import { FrownOutlined } from "@ant-design/icons"
import { Spin, Table, Modal, Progress, Popconfirm } from "antd"
import React, { useEffect, useState } from "react"
import calculateProgress from "../utils/calculateProgress"
import toast, { Toaster } from "react-hot-toast"
import moment from "moment"

const Session = () => {
  const [sessions, setSessions] = useState([])
  const [trainerSession, settrainerSession] = useState([])
  const [updateTrackModal, setupdateTrackModal] = useState(false)
  const [activityInfo, setactivityInfo] = useState([])
  const [user, setuser] = useState([])
  const [userSession, setuserSession] = useState([])
  const [sessionActivities, setSessionActivities] = useState([])
  const [doneActivities, setDoneActivities] = useState(0)

  console.log("Activities: ", sessionActivities)

  // modal ui
  const mainSessionActivty = sessionActivities.map((activity) => (
    <div className="flex  bg-white border-b-[2px] border-b-[#ccc] border-dashed pb-4 flex-col p-2 gap-3">
      <div>
        <h2 className="text-lg">{activity.title}</h2>
        <p>{activity.desc}</p>
      </div>
      {activity.status === true ? (
        <div className="flex items-center justify-between">
          <div className="bg-[#caffe2] p-2">
            <p color="green">Completed</p>
          </div>
          {activity.status === true ? (
            <button
              onClick={() => inCompleteActivity(activity?._id)}
              className="bg-[#08a88a] text-white rounded-md py-1 px-4"
            >
              Mark as Incomplete
            </button>
          ) : (
            <button
              onClick={() => completeActivity(activity?._id)}
              className="bg-[#08a88a] text-white rounded-md py-1 px-4"
            >
              Mark as complete
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="bg-[#f7ecea] p-2">
            <p className="text-[black]">Incomplete</p>
          </div>
          {activity.status === true ? (
            <button
              onClick={() => inCompleteActivity(activity?._id)}
              className="bg-[#08a88a] text-white rounded-md py-1 px-4"
            >
              Mark as Incomplete
            </button>
          ) : (
            <button
              onClick={() => completeActivity(activity?._id)}
              className="bg-[#08a88a] text-white rounded-md py-1 px-4"
            >
              Mark as complete
            </button>
          )}
        </div>
      )}
    </div>
  ))

  // get user center id
  let userCenterId
  let user_trainer_id
  let userId
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
    user_trainer_id = sessionStorage.getItem("userTrianerId")
    userId = sessionStorage.getItem("userId")
  }

  // get session activities
  const getSessionActivities = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setSessionActivities(result.user[0].session.activities)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const getCompletedActivities = () => {
    try {
      const allActivities = sessionActivities
      const doneActivities = allActivities.filter(
        (activity) => activity.status === true
      )
      setDoneActivities(doneActivities.length)
    } catch (err) {
      console.log(err)
    }
  }

  // get done act

  // get all center sessions
  const getSessions = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/sessions/center-sessions/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setSessions(result.center_sessions)
          console.log(result.center_sessions[0])
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get a user
  const getUser = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      }

      let response = await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        {
          method: "GET",
          headers: headersList,
        }
      )

      let data = await response.json()
      setuser(data.user)
      console.log(data.user)
      console.log(data.user)
      setuserSession(data.user[0]?.session)
      console.log("user session", data.user[0]?.session)
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

      await fetch(
        `http://localhost:1000/api/v1/sessions/approved/${user_trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerSession(result.approved_sessions)
          console.log(result.approved_sessions)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const completeActivity = async (activityId) => {
    // toast.success(activityId)
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/complete/${activityId} `,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Activity completed successfully") {
            toast.success(result.msg)
            console.log(result)
            getSessions()
            getTrainerSession()
            location.reload()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const inCompleteActivity = async (activityId) => {
    // toast.success(activityId)
    try {
      const requestOptions = {
        method: "PUT",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/session-activity/incomplete/${activityId} `,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Activity marked as incomplete") {
            toast.success(result.msg)
            console.log(result)
            getSessions()
            getTrainerSession()
            location.reload()
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
    setactivityInfo(info)
    setupdateTrackModal(true)
  }

  const registerSession = async (sessionId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      const raw = JSON.stringify({
        session_id: sessionId,
      })
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
      await fetch(
        `http://localhost:1000/api/v1/users/register/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "Session registered successfully") {
            toast.success(result.msg)
            getUser()
            console.log(result)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const formatDate = (date) => {
    return moment(date).format("ddd, MMM D, YYYY")
  }

  const cColumns = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      render: (_, session) => (
        <div className="flex gap-2">
          <p>{formatDate(session.start_date)}</p>
          <p>-</p>
          <p>{formatDate(session.end_date)}</p>
        </div>
      ),
    },
    {
      title: "Progress",
      render: (_, session) => (
        <div>
          <p>
            {calculateProgress(
              session
                ? session.activties.filter(
                    (activity) => activity.status === true
                  ).length
                : 0,
              session ? session.activties.length : 0
            )}{" "}
            %
          </p>
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_, session) => (
        <div>
          <Popconfirm
            title="Register the Session"
            description="Are you sure want to register session?"
            onConfirm={() => registerSession(session._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "#08a88a", color: "white" },
            }}
          >
            <button className="bg-[#08a88a] text-white rounded-md py-1 px-4">
              Register
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ]
  const tColumns = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      render: (_, session) => (
        <div>
          <p>Jan 20</p>
        </div>
      ),
    },
    {
      title: "Progress",
      render: (_, session) => (
        <div>
          <p>
            {calculateProgress(
              session
                ? session.activties.filter(
                    (activity) => activity.status === true
                  ).length
                : 0,
              session ? session.activties.length : 0
            )}{" "}
            %
          </p>
          {/* <p>{session ? session.activties.filter(activity => activity.status === false).length : 0}</p> */}
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_, session) => (
        <div>
          <Popconfirm
            title="Register the Session"
            description="Are you sure want to register session?"
            onConfirm={() => registerSession(session._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "#08a88a", color: "white" },
            }}
          >
            <button className="bg-[#08a88a] text-white rounded-md py-1 px-4">
              Register
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // init
  useEffect(() => {
    getUser()
    getSessions()
    getTrainerSession()
    getSessionActivities()
    getCompletedActivities()
  }, [])

  return (
    <div className="">
      <h1 className="text-2xl">My Session</h1>
      <br />

      <h2 className="font-bold text-xl mb-5">{userSession?.title}</h2>
      <div className="p-7 rounded-lg bg-white w-[250px] shadow-2xl">
        <h2 className="text-[#183642] font-bold">{userSession.title}</h2>
        <div className="flex  flex-col items-center gap-3 w-full text-center">
          <h3 className="font-black text-3xl my-2">
            {sessionActivities
              ? calculateProgress(
                  sessionActivities.filter(
                    (activity) => activity.status === true
                  ).length,
                  sessionActivities.length
                ) + "%"
              : "0%"}
          </h3>
          <Progress
            percent={calculateProgress(
              sessionActivities.filter((activity) => activity.status === true)
                .length,
              sessionActivities.length
            )}
            size="small"
            className="w-full"
          />
        </div>

        <div className="mt-3">
          <p className="text-sm text-[#818181]">
            <span className="mr-1">
              {
                sessionActivities.filter((activity) => activity.status === true)
                  .length
              }{" "}
            </span>
            / {sessionActivities.length}{" "}
            <span className="ml-2">Activities</span>
          </p>
        </div>
        <div
          onClick={() => populateSessionActivity(userSession?.activties)}
          className="mt-5 bg-[#08a88a] text-center cursor-pointer text-white p-2 rounded text-sm"
        >
          <button>Update Progress</button>
        </div>
      </div>
      <br />

      <div className="flex gap-2 items-center py-2">
        <div className="bg-[#fdf9fa] flex rounded-lg py-4 px-5 items-center">
          <p>{sessions.length}</p>
        </div>
        <h2 className="font-bold text-xl">
          Available Sessions Directly from Fitness Admin
        </h2>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <Table columns={cColumns} dataSource={sessions} />
      </div>
      <br />

      <div className="flex gap-2 items-center py-2">
        <div className="bg-[#fdf9fa] flex rounded-lg py-4 px-5 items-center">
          <p>{trainerSession?.length ? trainerSession?.length : "0"}</p>
        </div>
        <h2 className="font-bold text-xl">
          Available Sessions Directly from assigned Trainer
        </h2>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <Table columns={tColumns} dataSource={trainerSession} />
      </div>

      <Modal
        open={updateTrackModal}
        onCancel={() => setupdateTrackModal(false)}
        footer={[false]}
        centered
      >
        <h1 className="text-xl">Activities</h1>
        {mainSessionActivty}
      </Modal>
    </div>
  )
}

export default Session
