"use client"
import React, { useEffect, useState } from "react"
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import {
  ArrowRight,
  CloudCircleOutlined,
  FitnessCenter,
} from "@mui/icons-material"
import { message, Spin, Popconfirm, Modal, Form, Input, Select } from "antd"
import { Toaster, toast } from "react-hot-toast"

const Nutrition = () => {
  const [nutritionList, setNutritionList] = useState([])
  const [pendingNutrition, setPendingNutrtion] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // retrieve trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
  }

  // add nutrition
  const addNutrition = async () => {
    try {
      setIsAdding(true)
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food: null,
          time_of_day: null,
          category: null,
          isApproved: false,
          trainer_id: trainer_id,
          center_id: trainer_center_id,
          creator_type: "trainer",
        }),
      }

      const response = await fetch(
        "http://localhost:1000/api/v1/nutritions/create",
        requestOptions
      )

      if (response.ok) {
        setIsAdding(false)
        await getAllNutrition()
        await getPendingNutrition()
        toast.success("Nutrition added successfully")
        setIsAdding(false)
      } else {
        toast.error("Failed to add nutrition")
        setIsAdding(false)
      }
    } catch (error) {
      console.error("Error adding nutrition:", error)
      toast.error("Failed to add nutrition")
      setIsAdding(false)
    }
  }

  // get all nutrition
  const getAllNutrition = async () => {
    try {
      setIsLoading(true)
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/nutritions/all/trainer/approved/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setNutritionList(result.trainer)
          console.log(result.trainer)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    } finally {
      setIsLoading(false)
    }
  }

  // get pending nutritions
  const getPendingNutrition = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/nutritions/all/trainer/pending/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setPendingNutrtion(result.trainer)
          console.log(result.trainer)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllNutrition()
    getPendingNutrition()
  }, [])

  const deleteNutrition = async (nutritionid) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/delete/${nutritionid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          toast.success(result.msg)
          getAllNutrition()
          getPendingNutrition()
          console.log(result)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1 className="text-3xl">Nutritions</h1>
      <p className="flex text-[16px] py-4">
        Home
        <span>
          <ArrowRight />
        </span>{" "}
        Nutition
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {nutritionList ? nutritionList?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">Approved Nutritions</h1>
        </div>
        {/* generate new Nutrition */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => addNutrition()}
        >
          {isAdding ? (
            "Generating..."
          ) : (
            <>
              <PlusOutlined />
              <p>Generate Nutrition</p>
            </>
          )}
        </div>
      </div>

      {/* approved Nutrition */}
      <div className="flex gap-4 flex-wrap">
        {isLoading ? (
          <Spin size="small" />
        ) : nutritionList.length === 0 ? (
          <div className="m-auto flex py-3 flex-col items-center">
            <p>🙁</p>
            <p className="text-[#818181]">No nutritions yet</p>
          </div>
        ) : (
          nutritionList.map((nutrition, index) => (
            <div
              key={index}
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
                      onClick={() => setIsModalVisible(true)}
                      className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full"
                    />
                  </p>
                  <Popconfirm
                    title="Delete the Nutrition"
                    description="Are you sure to delete Nutrition?"
                    onConfirm={() => deleteNutrition(nutrition._id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: { backgroundColor: "red", color: "white" },
                    }}
                  >
                    <DeleteOutlined className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full" />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* pending Nutrition */}
      <div className="flex gap-2 py-5">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1 className="text-lg">
            {pendingNutrition ? pendingNutrition?.length : "0"}
          </h1>
        </div>
        <h1 className="text-2xl font-semibold py-2">Pending Nutritions</h1>
      </div>
      <div className="flex gap-4 flex-wrap">
        {isLoading ? (
          <Spin size="small" />
        ) : pendingNutrition.length === 0 ? (
          <div className="m-auto flex py-3 flex-col items-center">
            <p>🙁</p>
            <p className="text-[#818181]">No nutritions yet</p>
          </div>
        ) : (
          pendingNutrition.map((nutrition, index) => (
            <div
              key={index}
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
                      onClick={() => setIsModalVisible(true)}
                      className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full"
                    />
                  </p>
                  <Popconfirm
                    title="Delete the Nutrition"
                    description="Are you sure to delete Nutrition?"
                    onConfirm={() => deleteNutrition(nutrition._id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: { backgroundColor: "red", color: "white" },
                    }}
                  >
                    <DeleteOutlined className="text-[18px] mt-1 ml-4 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full" />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={isModalVisible}
        title="Update Nutrition"
        onCancel={() => setIsModalVisible(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-5">
          <div>
            <h1 className="text-lg">Food</h1>
            <Input className="py-4 ring-1 ring-[#ccc] outline-none" />
          </div>
          <div>
            <h1 className="text-lg">Time of day</h1>
            <Input className="py-4 ring-1 ring-[#ccc] outline-none" />
          </div>

          <div>
            <h1 className="text-lg">Nutrition Category</h1>
            <Select name="category" className="w-full">
              <Select.Option>Low Fat</Select.Option>
              <Select.Option>High-Protein</Select.Option>
              <Select.Option>Low-Sodium</Select.Option>
              <Select.Option>Weight Loss</Select.Option>
            </Select>
          </div>
          <button className="w-full text-white py-4 rounded-md bg-[#08a88a]">
            Update Nutrition
          </button>
        </Form>
      </Modal>
      <Toaster />
    </div>
  )
}

export default Nutrition
