"use client"
import React, { useState, useEffect } from "react"
import { Spin, Modal } from "antd"
import { CloudCircleOutlined, FitnessCenter } from "@mui/icons-material"
import { EyeOutlined, FrownOutlined } from "@ant-design/icons"

const Nutrition = () => {
  const [fitnessNutrition, setfitnessNutrition] = useState([])
  const [trainerNutrition, settrainerNutrition] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentNutrition, setcurrentNutrition] = useState(null)
  const [previewModla, setpreviewModal] = useState(false)

  // get user center id and assinged trainer id
  let userCenterId
  let user_trainer_id
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
    user_trainer_id = sessionStorage.getItem("userTrianerId")
  }

  const populateNutrition = (info) => {
    setcurrentNutrition(info)
    setpreviewModal(true)
  }

  // get center fitness nutrition
  const getFitnessNutrition = async () => {
    try {
      setIsLoading(true)
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/all/center/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setfitnessNutrition(result.admin)
          console.log(result.admin)
        })
        .catch((error) => console.log("error", error))
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // get approved nutrition
  const getApprovedNutrition = async () => {
    try {
      setIsLoading(true)
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/trainer/approved/${user_trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerNutrition(result.approved_nutrition)
          console.log(result.approved_nutrition)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFitnessNutrition()
    getApprovedNutrition()
  }, [])

  return (
    <div>
      <h1 className="text-2xl">Fitness Center Nutrition</h1>
      <br />
      <div>
        <div className="flex gap-5">
          {isLoading ? (
            <Spin size="small" />
          ) : fitnessNutrition.length === 0 ? (
            <div className="m-auto flex py-3 flex-col items-center gap-2">
              <FrownOutlined />
              <p className="text-[#818181]">
                No new Nutritions added yet from nutrition
              </p>
            </div>
          ) : (
            fitnessNutrition.map((nutrition, index) => (
              <div
                key={index}
                onClick={() => populateNutrition(nutrition)}
                className="flex flex-col items-center justify-center p-5 bg-white rounded-lg hover:shadow-md cursor-pointer py-6 w-[200px]"
              >
                <p className="font-bold">{nutrition.food}</p>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center text-[#818181] gap-2 text-[14px]">
                    <CloudCircleOutlined className="text-[18px]" />
                    <p>{nutrition.time_of_day}</p>
                  </div>
                  <div className="flex items-center text-[#818181] gap-6 text-[14px]">
                    <FitnessCenter className="text-[18px]" />
                    <p>{nutrition.category}</p>
                  </div>
                  <hr className="mt-4" />
                  <div className="flex items-center justify-center gap-2 text-[#818181]">
                    <p>
                      <EyeOutlined
                        onClick={() => populateNutrition(nutrition)}
                        className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full"
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5">
          <h1 className="text-2xl py-5">Assigned Trainer Nutrition</h1>
          <div className="flex gap-5">
            {isLoading ? (
              <Spin size="small" />
            ) : trainerNutrition.length === 0 ? (
              <div className="m-auto flex py-3 flex-col items-center gap-2">
                <FrownOutlined />
                <p className="text-[#818181]">
                  No new Nutritions added yet from nutrition
                </p>
              </div>
            ) : (
              trainerNutrition.map((nutrition, index) => (
                <div
                  key={index}
                  onClick={() => populateNutrition(nutrition)}
                  className="flex flex-col items-center justify-center p-5 bg-white rounded-lg hover:shadow-md cursor-pointer py-6 w-[200px]"
                >
                  <p className="font-bold">{nutrition.food}</p>

                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center text-[#818181] gap-2 text-[14px]">
                      <CloudCircleOutlined className="text-[18px]" />
                      <p>{nutrition.time_of_day}</p>
                    </div>
                    <div className="flex items-center text-[#818181] gap-6 text-[14px]">
                      <FitnessCenter className="text-[18px]" />
                      <p>{nutrition.category}</p>
                    </div>
                    <hr className="mt-4" />
                    <div className="flex items-center justify-center gap-2 text-[#818181]">
                      <p>
                        <EyeOutlined
                          onClick={() => populateNutrition(nutrition)}
                          className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        centered
        open={previewModla}
        footer={false}
        onCancel={() => setpreviewModal(false)}
      >
        <div className="flex items-center justify-center m-auto">
          <h1>Today Nutrition</h1>
        </div>
        <p>{currentNutrition?.food}</p>

        <p> {currentNutrition?.time_of_day}</p>
        <p>{currentNutrition?.category}</p>
        <button
          onClick={() => setpreviewModal(false)}
          className="bg-[#08a88a] text-white py-2 px-4 rounded-lg items-center justify-center flex m-auto"
        >
          Close
        </button>
      </Modal>
    </div>
  )
}

export default Nutrition
