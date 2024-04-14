"use client"
import {
  Phone,
  SearchRounded,
  ArrowLeft,
  EmailOutlined,
  LocationOnOutlined,
} from "@mui/icons-material"
import { PhoneOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { Skeleton, Tag } from "antd"

const handleRating = (rate) => {
  const stars = []

  for (let i = 0; i < rate; i++) {
    stars.push("⭐️ ")
  }

  return stars
}

const Center = () => {
  const [allfitness, setAllfitness] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const getAllCenters = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch("http://localhost:1000/api/v1/admins/all", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setAllfitness(result.fitness_centers)
          console.log(result.fitness_centers)
          setLoading(false)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCenters()
  }, [])

  const handleFitnessCenterClick = (centerId) => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem("userCenterId", centerId)
    }

    window.location.href = "/userViewFitnessInfo"
  }

  const [recommended, setRecommended] = useState([])

  const handleRecommended = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/admins/recomended",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setRecommended(result.recomended)
          console.log(result.recomended)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleRecommended()
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)

    const filteredResults = allfitness.filter((center) =>
      center.name.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(filteredResults)
  }

  const moveBack = () => {
    window.history.back()
  }

  return (
    <div className="bg-[#edf1f7] min-h-screen flex flex-col items-center gap-5 w-full">
      <div className="w-full h-[50vh] home flex flex-col justify-center items-center">
        <button className="text-white flex bg-[#08A88A] px-5 py-3 rounded-full gap-1 absolute top-3 right-[40px] cursor-pointer">
          <LocationOnOutlined />
          <h1>Near Me</h1>
        </button>
        <div className="text-center">
          <div
            className="bg-white rounded-full items-center absolute top-5 left-[45px] cursor-pointer"
            onClick={() => moveBack()}
          >
            <ArrowLeft />
          </div>
          <h1 className="font-bold text-5xl mb-2 text-white">
            Browse the range of Fitness Centerss
          </h1>
          <p className="text-[#cfcfcf] text-lg">
            Register with your preferred fitness center today
          </p>
        </div>
        <form
          action=""
          className="bg-white p-2 rounded-md text-center w-[40%] mt-5 flex items-center gap-2 shadow"
        >
          <SearchRounded className="text-[#f1f1f1]" />

          <input
            type="text"
            placeholder="Search fitness centers..."
            className="p-1 w-full outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>

      {searchQuery ? (
        searchResults.length === 0 ? (
          <p className="text-xl mt-4">No fitness centers found</p>
        ) : (
          <div className="text-left mt-4">
            <h1 className="text-3xl text-left font-bold my-5 ml-[170px]">
              Matching Fitness Center
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {searchResults.map((result) => (
                <div
                  className="bg-white w-[330px] rounded-lg cursor-pointer overflow-hidden"
                  key={result._id}
                  onClick={() => handleFitnessCenterClick(result._id)}
                >
                  <div
                    className="h-[300px]"
                    style={{
                      backgroundImage: `url(${
                        result ? `http://localhost:1000/${result.photo}` : ""
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-10">
                    <h2 className="font-semibold text-lg gap-2">
                      {result.name}
                    </h2>
                    <p className="text-gray-500 ">
                      <LocationOnOutlined className="mr-2" /> {result.location}
                    </p>
                    <p className="text-gray-500  mb-1">
                      <EmailOutlined className="mr-2" />
                      {result.email}
                    </p>
                    <p className="text-gray-500 mb-2">
                      <Phone className="mr-2" />
                      {result.phone}
                    </p>
                    <p>
                      {result.rating === 0 ? (
                        <p className="gray-700">No ratings yet </p>
                      ) : (
                        handleRating(result.rating).map((star, index) => (
                          <span key={index}>{star}</span>
                        ))
                      )}
                    </p>
                    <p className="mt-2">
                      {result.isOpened ? (
                        <Tag color="green">Opened</Tag>
                      ) : (
                        <Tag color="red">Closed</Tag>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <>
          <div>
            <h1 className="flex text-3xl text-left font-bold my-6">
              Recommended Fitness Centers
            </h1>
            <div className="flex items-start justify-start"> 
              <div className="flex flex-wrap gap-2 justify-center">
                {loading ? (
                  <Skeleton active className="w-[100%]" />
                ) : (
                  recommended.map((recommend) => (
                    <div
                      className="bg-white w-[330px] rounded-lg cursor-pointer overflow-hidden"
                      key={recommend.id}
                      onClick={() => handleFitnessCenterClick(recommend._id)}
                    >
                      <div
                        className="h-[300px] myGradient"
                        style={{
                          backgroundImage: `url(${
                            recommend
                              ? `http://localhost:1000/${recommend.photo}`
                              : ""
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="p-10">
                          <h2 className="font-semibold text-xl gap-2 text-white">
                            {recommend.name}
                          </h2>
                          <p className="text-white text-sm mt-2">
                            <LocationOnOutlined className="mr-2" />{" "}
                            {recommend.location}
                          </p>
                          <p className="text-white mb-1">
                            <EmailOutlined className="mr-2" />
                            {recommend.email}
                          </p>
                          <p className="text-white mb-2">
                            <PhoneOutlined className="scale-x-[-1] ml-[2px]" />
                            {recommend.phone}
                          </p>
                          <p>
                            {recommend.rating === 0 ? (
                              <p className="gray-700">No ratings yet </p>
                            ) : (
                              handleRating(recommend.rating).map(
                                (star, index) => <span key={index}>{star}</span>
                              )
                            )}
                          </p>
                          <p className="mt-2">
                            {recommend.isOpened ? (
                              <Tag color="green">Opened</Tag>
                            ) : (
                              <Tag color="red">Closed</Tag>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="">
            <h1 className="text-3xl text-left font-bold pl-[10rem] mb-4 mt-8">
              All Fitness Centers
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {loading ? (
                <Skeleton active className="mt-4" />
              ) : (
                allfitness.map((center) => (
                  <div
                    className="bg-white w-[330px] rounded-lg cursor-pointer overflow-hidden"
                    key={center._id}
                    onClick={() => handleFitnessCenterClick(center._id)}
                  >
                    <div className="h-[300px] relative">
                      {center.photo ? (
                        <img
                          src={`http://localhost:1000/${center.photo}`}
                          alt="Center Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black opacity-20"></div>
                      )}
                    </div>
                    <div className="p-10">
                      <h2 className="font-semibold text-lg gap-2">
                        {center.name}
                      </h2>
                      <p className="text-gray-500 ">
                        <LocationOnOutlined className="mr-2" />{" "}
                        {center.location}
                      </p>
                      <p className="text-gray-500  mb-1">
                        <EmailOutlined className="mr-2" />
                        {center.email}
                      </p>
                      <p className="text-gray-500 mb-2 items-center flex gap-4">
                        <PhoneOutlined className="scale-x-[-1] ml-[2px]" />
                        {center.phone}
                      </p>
                      <p>
                        {center.rating === 0 ? (
                          <p className="gray-700">No ratings yet </p>
                        ) : (
                          handleRating(center.rating).map((star, index) => (
                            <span key={index}>{star}</span>
                          ))
                        )}
                      </p>
                      <p className="mt-2">
                        {center.isOpened ? (
                          <Tag color="green">Opened</Tag>
                        ) : (
                          <Tag color="red">Closed</Tag>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Center
