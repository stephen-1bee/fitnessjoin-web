"use client"
import React, { useState, useEffect } from "react"
import {
  ArticleOutlined,
  FoodBankOutlined,
  SportsGymnasticsOutlined,
} from "@mui/icons-material"
import { PieChart, Pie, Cell } from "recharts"
import { UserSwitchOutlined } from "@ant-design/icons"

const Dashboard = () => {
  const [nutrition, setnutrition] = useState([])
  const [articles, setarticles] = useState([])
  const [session, setSession] = useState([])
  const [users, setUser] = useState([])

  // get trainer id trainer fitness id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
  }

  // get trainer dashboard
  const getDashboard = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/trainer-dashboard/${trainer_center_id}/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setSession(result.trainer_sessions)
          setnutrition(result.trainer_nutrition)
          setUser(result.assigned_users)
          setarticles(result.trainer_articles)
          console.log(result)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getDashboard()
  }, [])

  const data = [
    { name: "Sessions", value: session },
    { name: "Nutritions", value: nutrition },
    { name: "Assigned Users", value: users },
    { name: "Artcles", value: articles },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div>
      <h1 className="text-3xl mb-2">My Dashboard</h1>
      <div className="flex justify-center gap-5">
        {/* Canvas */}
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
        <div className="flex flex-wrap gap-5">
          {/* session */}
          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#0088FE] rounded-full p-5 text-left">
              <SportsGymnasticsOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">{session ? session : "0"}</p>
              {session === 1
                ? "Session"
                : session <= 0
                ? "No Sessions"
                : "Sessions"}
            </div>
          </div>
          {/* Articles */}
          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#FFBB28] rounded-full p-5 text-left">
              <ArticleOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">
                {articles ? articles : null}
              </p>
              {articles === 1
                ? "Article"
                : articles <= 0
                ? "No Article"
                : "Articles"}
            </div>
          </div>

          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#00C49F] rounded-full p-5 text-left">
              <FoodBankOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">
                {nutrition ? nutrition : null}
              </p>
              {nutrition === 1
                ? "Nutrition"
                : nutrition <= 0
                ? "No Nutritions"
                : "Nutrition"}
            </div>
          </div>

          {/*  USERS */}
          <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
            <div className="flex bg-[#FF8042] rounded-full p-5 text-left">
              <UserSwitchOutlined className="text-[25px] text-white" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-center text-2xl">{users ? users : null}</p>
              {users === 1
                ? "Assigned User"
                : users <= 0
                ? "No Assinged Users"
                : "Assigned Users"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
