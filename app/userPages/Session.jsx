import React, { useEffect, useState } from "react"
import { Spin, Table, Modal, Progress, Popconfirm } from "antd"
import moment from "moment"

const Session = () => {
  const [userSessionId, setUserSessionId] = useState(null)
  const [sessions, setSessions] = useState([])
  const [trainerSession, settrainerSession] = useState([])
  const [user, setUser] = useState()

  let userCenterId
  let user_trainer_id
  let userId
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
    user_trainer_id = sessionStorage.getItem("userTrianerId")
    userId = sessionStorage.getItem("userId")
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
    // {
    //   title: "Progress",
    //   render: (_, session) => (
    //     <div>
    //       <p>
    //         {calculateProgress(
    //           session
    //             ? session.activties.filter(
    //                 (activity) => activity.status === true
    //               ).length
    //             : 0,
    //           session ? session.activties.length : 0
    //         )}{" "}
    //         %
    //       </p>
    //     </div>
    //   ),
    // },
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
    // {
    //   title: "Progress",
    //   render: (_, session) => (
    //     <div>
    //       <p>
    //         {calculateProgress(
    //           session
    //             ? session.activties.filter(
    //                 (activity) => activity.status === true
    //               ).length
    //             : 0,
    //           session ? session.activties.length : 0
    //         )}{" "}
    //         %
    //       </p>
    //       {/* <p>{session ? session.activties.filter(activity => activity.status === false).length : 0}</p> */}
    //     </div>
    //   ),
    // },
    {
      title: "Actions",
      render: (_, session) => (
        <div>
          <Popconfirm
            title="Register the Session"
            description="Are you sure want to register session?"
            // onConfirm={() => registerSession(session._id)}
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

  // // retrieving user id
  // let userId
  // let user_center_id
  // if (typeof sessionStorage !== "undefined") {
  //   userId = sessionStorage.getItem("userId")
  //   user_center_id = sessionStorage.getItem("userCenterId")
  // }

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
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  console.log("USER: ", user)
  console.log("SESSION_ID", userSessionId)
  // get user
  // get a user
  const getUser = async () => {
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
          setUser(result.user)
          setUserSessionId(result.user[0].session_id)
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

      await fetch(
        `http://localhost:1000/api/v1/sessions/approved/${user_trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerSession(result.approved_sessions)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const getFitnessSession = () => {
    try {
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
    getSessions()
    getFitnessSession()
    getTrainerSession()
  }, [])

  return (
    <div>
      <h2 className="font-bold text-2xl">Session</h2>
      <p>session id: {userSessionId}</p>
      {/* session progress card */}
      <div className="bg-white p-7 rounded-lg shadow-2xl mt-4 w-[200px]">
        <h2 className="font-bold text-2xl">60%</h2>
        <div>
          <p className="text-sm mt-2 text-[#818181]">0 / 0 Activities</p>
        </div>
      </div>
      <br />
      <h1 className="text-xl ">Session Directly from fitness Session</h1>
      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <Table columns={cColumns} dataSource={sessions} />
      </div>

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
    </div>
  )
}

export default Session
