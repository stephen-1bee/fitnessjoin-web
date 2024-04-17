import { useState, useEffect } from "react"
import React from "react"
import { PieChart, Pie, Cell } from "recharts"
import {
  ArticleOutlined,
  FoodBankOutlined,
  SportsGymnasticsOutlined,
} from "@mui/icons-material"

const Dashboard = () => {
  const [sessionActivities, setSessionActivities] = useState([])
  const [trainerSession, settrainerSession] = useState([])
  const [sessions, setSessions] = useState([])

  // get user center id
  let userCenterId
  let user_trainer_id
  let userId
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
    user_trainer_id = sessionStorage.getItem("userTrianerId")
    userId = sessionStorage.getItem("userId")
  }

  const data = [
    { name: "Activities", value: sessionActivities },
    { name: "Trainer Sessions", value: trainerSession?.length },
    { name: "Fitness Sessions", value: sessions?.length },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

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

  useEffect(() => {
    getSessionActivities()
    getTrainerSession()
    getSessions()
  }, [])

  return (
    <div className="flex flex-col justify-center gap-5">
      <h1 className="text-2xl">Dashboard</h1>
      <div className="flex">
        
        <div className="bg-white w-[500px] mr-12 p-12  items-center shadow-lg rounded-lg">
          <PieChart width={800} height={400}>
            <Pie
              className="text-center"
              data={data}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={10}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="flex gap-5">
          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#0088FE] rounded-full p-5 text-left">
              <SportsGymnasticsOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">
                {sessions ? sessions?.length : "0"}
              </p>
              {sessions?.length === 1 ? (
                <p className="text-center">Fitness Session</p>
              ) : sessions?.length <= 0 ? (
                <p className="text-center">No Fitness Sessions</p>
              ) : (
                <p className="text-center">Fitness Sessions</p>
              )}
            </div>
          </div>

          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#00C49F] rounded-full p-5 text-left">
              <SportsGymnasticsOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">
                {trainerSession ? trainerSession?.length : "0"}
              </p>
              {trainerSession?.length === 1 ? (
                <p className="text-center">Trainer Session</p>
              ) : trainerSession?.length <= 0 ? (
                <p className="text-center"> No Trainer Sessions</p>
              ) : (
                <p className="text-center">Trainer</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
