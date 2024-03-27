"use client"
import React, { useState, useEffect } from "react"
import {
  message,
  Spin,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Tag,
} from "antd"
import {
  ArrowRight,
  CloudCircleOutlined,
  FitnessCenter,
  FoodBankOutlined,
} from "@mui/icons-material"
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import { Toaster, toast } from "react-hot-toast"

const FitnessNutrition = () => {
  const [nutritionList, setNutritionList] = useState([])
  const [trainerNutrition, settrainerNutrition] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const confirm = (e) => {
    console.log(e)
  }

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  const cancel = (e) => {
    console.log(e)
  }

  // delete nutrition
  const deleteNutrition = async (nutritionid) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/nutritions/delete/${nutritionid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "nutrition deleted successfully") {
            toast.success(result.msg)
            console.log(result)
            getAllNutrition()
            getTrainerNutrition()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
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
          isApproved: true,
          center_id: storedFitnessId,
          creator_type: "center",
        }),
      }

      const response = await fetch(
        "http://localhost:1000/api/v1/nutritions/create",
        requestOptions
      )

      if (response.ok) {
        setIsAdding(false)
        await getAllNutrition()
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

  // get center fitness nutrition
  const getAllNutrition = async () => {
    try {
      setIsLoading(true)
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/all/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setNutritionList(result.admin)
          console.log(result.admin)
        })
        .catch((error) => console.log("error", error))
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // get affiliate trainer nutrition
  const getTrainerNutrition = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/trainer-nutritions/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerNutrition(result.trainer)
          console.log(result.trainer)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const handleToggle = (nutritionid, isApproved) => {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = isApproved
      ? `http://localhost:1000/api/v1/nutritions/disapprove/${nutritionid}`
      : `http://localhost:1000/api/v1/nutritions/approve/${nutritionid}`

    fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        getTrainerNutrition()
        console.log(result)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getAllNutrition()
    getTrainerNutrition()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="flex gap-2 items-center">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <FoodBankOutlined color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Nutrition</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Nutrition plan
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {nutritionList ? nutritionList?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">My Nutritions</h1>
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
                    onCancel={cancel}
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

      {/* affiliate trainer */}
      <div>
        <div className="flex gap-2 py-5">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {trainerNutrition ? trainerNutrition?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">
            Affiliate Trainer Nutritions
          </h1>
        </div>
        <div className="flex gap-4 flex-wrap">
          {isLoading ? (
            <Spin size="small" />
          ) : trainerNutrition.length === 0 ? (
            <div className="m-auto flex py-3 flex-col items-center">
              <p>🙁</p>
              <p className="text-[#818181]">No nutritions yet</p>
            </div>
          ) : (
            trainerNutrition.map((nutrition, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-5 bg-white rounded-lg hover:shadow-md cursor-pointer py-6 w-[200px]"
              >
                <p className="font-bold">{nutrition.food}</p>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center justify-center text-[#818181] gap-2 text-[14px]">
                    <CloudCircleOutlined className="text-[18px]" />
                    <p>{nutrition.time_of_day}</p>
                  </div>
                  <div className="flex items-center text-[#818181] gap-6 text-[14px]">
                    <FitnessCenter className="text-[18px]" />
                    <p>{nutrition.category}</p>
                  </div>
                  <hr className="mt-4" />
                  <div className="flex items-center justify-center gap-1 text-[#818181]">
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
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{
                        style: { backgroundColor: "red", color: "white" },
                      }}
                    >
                      <DeleteOutlined className="text-[18px] mt-1 hover:ring-1 hover: ring-[#ccc] p-2 rounded-full" />
                    </Popconfirm>
                    <div
                      className="bg-[#08a88a] h-7 w-7 rounded-full flex items-center justify-center hover:shadow-md"
                      title={
                        nutrition.isApproved
                          ? "dissapprove nutrition"
                          : "Approve nutrition"
                      }
                      onClick={() =>
                        handleToggle(nutrition._id, nutrition.isApproved)
                      }
                    >
                      <h1 className="text-white">
                        {nutrition.isApproved ? <CheckOutlined /> : "x"}
                      </h1>
                    </div>
                  </div>
                </div>
                <p>
                  <Tag color={nutrition.isApproved ? "green" : "red"}>
                    {nutrition.isApproved ? "approved" : "pending"}
                  </Tag>
                </p>
                <p>{nutrition.trainer[0]?.name}</p>
              </div>
            ))
          )}
        </div>
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

export default FitnessNutrition
