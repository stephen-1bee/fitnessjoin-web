"use client"
import React, { useEffect, useState } from "react"
import {
  DeleteOutlined,
  EyeOutlined,
  FrownOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import {
  ArrowRight,
  CloudCircleOutlined,
  FitnessCenter,
} from "@mui/icons-material"
import { Spin, Popconfirm, Modal, Form, Input, Select } from "antd"
import { Toaster, toast } from "react-hot-toast"

const Nutrition = () => {
  const [approvedNutrition, setApprovedNutrition] = useState([])
  const [pendingNutrition, setPendingNutrtion] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [trainer, setTrainer] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [goals, setgoals] = useState([])
  const [food, setfood] = useState("")
  const [time_of_day, settime_of_day] = useState("")
  const [category, setcategory] = useState("")

  // retrieve trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
  }

  // get trainer
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

  const eligible = trainer.isAccepted

  // add nutrition
  const addNutrition = async () => {
    if (eligible === false) {
      return toast.error(
        "You are not eligible to add Nutrition yet. Please contact the  administrator."
      )
    }
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
        await getApprovedNutrition()
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

  // get approved nutrition
  const getApprovedNutrition = async () => {
    try {
      setIsLoading(true)
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/trainer/approved/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setApprovedNutrition(result.approved_nutrition)
          console.log(result.approved_nutrition)
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
      setIsLoading(true)
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/trainer/pending/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setPendingNutrtion(result.pending_nutrition)
          console.log(result.pending_nutrition)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    gettrainer()
    getApprovedNutrition()
    getPendingNutrition()
  }, [])

  const [currentNutrition, setCurrentNutrition] = useState(null)

  const populateNutrition = (info) => {
    setCurrentNutrition(info)
    setIsModalVisible(true)
  }

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
          if (result.msg === "nutrition deleted successfully") {
            toast.success(result.msg)
            getApprovedNutrition()
            getPendingNutrition()
            console.log(result.msg)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  const getGoals = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/center/${trainer_center_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setgoals(result.center_goals)
          console.log(result)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getGoals()
  }, [])

  // handle update nutrition
  const handleUpdate = async (nutritionId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        food: food ? food : currentNutrition?.food,
        time_of_day: time_of_day ? time_of_day : currentNutrition?.time_of_day,
        category: category ? category : currentNutrition?.category,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/nutritions/update/${nutritionId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "nutrition updated successfully") {
            toast.success(result.msg)
            console.log(result.msg)
            getApprovedNutrition()
            getPendingNutrition()
            setIsModalVisible(false)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
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
              {approvedNutrition ? approvedNutrition?.length : "0"}
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
        ) : approvedNutrition.length === 0 ? (
          <div className="m-auto flex py-5 gap-2 flex-col items-center">
            <FrownOutlined />
            <p className="text-[#818181]">No active Nutritions Yet</p>
          </div>
        ) : (
          approvedNutrition.map((nutrition, index) => (
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
                      onClick={() => populateNutrition(nutrition)}
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
          <div className="m-auto flex py-5 gap-2 flex-col items-center">
            <FrownOutlined />
            <p className="text-[#818181]">No Pending Nutritions Yet</p>
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
                      onClick={() => populateNutrition(nutrition)}
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
        <Form className="flex flex-col gap-5" key={currentNutrition?._id}>
          <div>
            <h1 className="text-lg">Food</h1>
            <Input
              onChange={(e) => setfood(e.target.value)}
              defaultValue={currentNutrition?.food}
              className="py-4 ring-1 ring-[#ccc] outline-none"
            />
          </div>
          <div>
            <h1 className="text-lg">Time of day</h1>
            <Input
              onChange={(e) => settime_of_day(e.target.value)}
              defaultValue={currentNutrition?.time_of_day}
              className="py-4 ring-1 ring-[#ccc] outline-none"
            />
          </div>

          <div>
            <h1 className="text-lg">Nutrition Category</h1>
            <Select
              className="py-4 outline-none w-full"
              onChange={(text) => setcategory(text)}
              defaultValue={currentNutrition?.category}
              options={goals.map((cat) => ({
                value: cat.goal,
                label: cat.goal,
              }))}
            />
          </div>
          <button
            onClick={() => handleUpdate(currentNutrition._id)}
            className="w-full text-white py-4 rounded-md bg-[#08a88a]"
          >
            Update Nutrition
          </button>
        </Form>
      </Modal>
      <Toaster />
    </div>
  )
}

export default Nutrition
