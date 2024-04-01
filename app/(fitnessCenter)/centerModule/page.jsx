"use client"
import React, { useState } from "react"
import CenterSideNav from "@/app/components/CenterSideNav"
import FitnessDashboard from "../FitnessDashboard"
import FitnessMembers from "../FitnessMembers"
import FitnessTrainers from "../FitnessTrainers"
import FitnessSessions from "../FitnessSessions"
import FitnessNutrition from "../FitnessNutrition"
import FitnessArticles from "../FitnessArticles"
import FitnessFeedbacks from "../FitnessFeedbacks"
import FitnessMembership from "../FitnessMembership"
import FitnessGoals from "../FitnessGoals"
import FitnessSettings from "../FitnessSettings"
import Broadcast from "../Broadcast"
import CenterNav from "@/app/components/CenterNav"
import NewSideNave from "@/app/components/NewSideNave"

const page = () => {
  const [activeItem, setActiveItem] = useState("")

  let center_id

  if (typeof sessionStorage !== "undefined") {
    center_id = sessionStorage.getItem("fitnessCenterId")
  }

  const renderContent = () => {
    switch (activeItem) {
      case "FitnessDashboard":
        return (
          <div>
            <FitnessDashboard />
          </div>
        )
      case "FitnessMembers":
        return (
          <div>
            <FitnessMembers />
          </div>
        )
      case "FitnessTrainers":
        return (
          <div>
            <FitnessTrainers />
          </div>
        )
      case "FitnessSessions":
        return (
          <div>
            <FitnessSessions />
          </div>
        )
      case "FitnessNutrition":
        return (
          <div>
            <FitnessNutrition />
          </div>
        )
      case "FitnessArticles":
        return (
          <div>
            <FitnessArticles />
          </div>
        )
      case "FitnessFeedbacks":
        return (
          <div>
            <FitnessFeedbacks />
          </div>
        )
      case "Settings":
        return (
          <div>
            <FitnessSettings />
          </div>
        )
      case "FitnessMemberships":
        return (
          <div>
            <FitnessMembership />
          </div>
        )
      case "FitnessGoals":
        return (
          <div>
            <FitnessGoals />
          </div>
        )
      case "Broadcast":
        return (
          <div>
            <Broadcast />
          </div>
        )

      case "Logout":
        return <div>Logout Content</div>
      default:
        return (
          <div>
            <FitnessDashboard />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="bg-[#fdf9f0] w-[340px]">
        <NewSideNave setActiveItem={setActiveItem} activeItem={activeItem} />
      </div>
      <div className="flex flex-col w-full">
        <CenterNav />
        <div className="p-6 overflow-y-auto bg-[#f0f0f0] w-full h-full mt-[100px]">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default page
