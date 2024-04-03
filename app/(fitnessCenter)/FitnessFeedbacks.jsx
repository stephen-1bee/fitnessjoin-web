"use client"
import {
  DeleteOutlined,
  FrownOutlined,
  QuestionOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Popconfirm } from "antd"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { ArrowRight, Person2Outlined } from "@mui/icons-material"
import moment from "moment"

const FitnessFeedbacks = () => {
  const [trainerFeedback, settrainerFeedback] = useState([])
  const [userFeedback, setUserFeedback] = useState([])

  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  const formattDate = (date) => {
    return moment(date).format("MMM dd, yyyy")
  }

  const getTrainerFeedback = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/feedbacks/trainers/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerFeedback(result.trainer_feedbacks)
          console.log(result.trainer_feedbacks)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  const getUserFeedback = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/feedbacks/users/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setUserFeedback(result.user_feedbacks)
          console.log(result.user_feedbacks)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // delete feedback
  const handleDelete = async (feedbackId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }
      await fetch(
        `http://localhost:1000/api/v1/feedbacks/delete/${feedbackId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "feedback deleted sucessfully") {
            toast.success(result.msg)
            console.log(result)
            getTrainerFeedback()
            getUserFeedback()
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
    getTrainerFeedback()
    getUserFeedback()
  }, [])

  return (
    <div className="flex gap-3 w-full">
      <br />

      <div className="flex gap-4 w-full flex-col">
        <div className="flex gap-2 flex-col ">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
              <Person2Outlined color="white" className="text-white " />
            </div>
            <h1 className="text-2xl">My Feedbacks</h1>
          </div>
          <p className="flex text-[16px] py-2">
            Home
            <span>
              <ArrowRight />
            </span>
            Feedbacks
          </p>
        </div>
        <div className="lg:flex-row flex gap-4 w-full flex-col">
          {/*Trainer feedback list */}
          <div className="bg-white p-5 rounded-lg shadow-md flex-1 overflow-y-auto h-[500px]">
            <h1 className="font-bold text-xl">Trainers Feedback List</h1>

            {trainerFeedback.length >= 1 ? (
              <div>
                {trainerFeedback.map((feedback) => (
                  <div className="border-b border-[#ededed] pb-4 pt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-bold flex gap-2 items-center">
                        <UserOutlined /> {feedback.trainer[0]?.name}
                      </h2>
                      <p className="text-[#818181] ml-6">{feedback.message}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end ">
                      <p className="text-[12px]">
                        {formattDate(feedback.dateCreated)}
                      </p>
                      <Popconfirm
                        title="Delete Feedback"
                        description="Are you sure to delete User's Feedback?"
                        onConfirm={() => handleDelete(feedback._id)}
                        okText="Delete"
                        cancelText="No"
                        okButtonProps={{
                          style: { backgroundColor: "red", color: "white" },
                        }}
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-col items-center justify-center mt-5">
                <FrownOutlined />
                <p>No Feedbacks from trainers Yet</p>
              </div>
            )}
          </div>

          {/*user feedback list */}
          <div className="bg-white p-5 rounded-lg shadow-md flex-1 overflow-y-auto h-[500px]">
            <h1 className="font-bold text-lg">Clients Feedback List</h1>
            {userFeedback.length >= 1 ? (
              <div>
                {userFeedback.map((feedback) => (
                  <div className="border-b border-[#ededed] pb-4 pt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-bold flex gap-2 items-center">
                        <UserOutlined /> {feedback.user[0]?.first_name}
                        {feedback.user[0]?.last_name}
                      </h2>
                      <p className="text-[#818181] ml-6">{feedback.message}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end ">
                      <p className="text-[12px]">
                        {formattDate(feedback.dateCreated)}
                      </p>
                      <Popconfirm
                        title="Delete Feedback"
                        description="Are you sure to delete User's Feedback?"
                        onConfirm={() => handleDelete(feedback._id)}
                        okText="Delete"
                        cancelText="No"
                        okButtonProps={{
                          style: { backgroundColor: "red", color: "white" },
                        }}
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-col items-center justify-center mt-5">
                <FrownOutlined />
                <p>No Feedbacks from Users Yet</p>
              </div>
            )}
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  )
}

export default FitnessFeedbacks
