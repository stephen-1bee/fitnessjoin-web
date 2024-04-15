import React, { useState, useEffect } from "react"
import { ClockCircleOutlined, FrownOutlined } from "@ant-design/icons"
import { AttachFileOutlined } from "@mui/icons-material"
import moment from "moment"
import Image from "next/image"
import { Modal } from "antd"

const Articles = () => {
  const [fitnessArticles, setAllFitnessArticles] = useState([])
  const [trainerArticles, setTrainerArcles] = useState([])
  const [read, setread] = useState(false)

  const [currentArticle, setcurrentArticle] = useState(null)

  const populateArticle = (info) => {
    setcurrentArticle(info)
  }

  // get user center id and assinged trainer id
  let userCenterId
  let user_trainer_id
  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId")
    user_trainer_id = sessionStorage.getItem("userTrianerId")
  }

  // get center articles
  const getFitnessArticles = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/center-articles/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAllFitnessArticles(result.center)
          console.log(result.center)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get pending articles
  const getTrainerArticles = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/trainer/approved/${user_trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainerArcles(result.approved_articles)
          console.log(result.approved_articles)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getFitnessArticles()
    getTrainerArticles()
  }, [])

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  return (
    <div className="">
      {/* <Tag */}
      <h1 className="text-2xl py-1">My Fitness Articless</h1>
      <br />
      <div>
        {fitnessArticles ? (
          <div className="grid grid-cols-4">
            {fitnessArticles.map((article) => (
              <div
                key={article._id}
                className="bg-white p-4 rounded-lg shadow w-[300px]"
                onClick={() => populateArticle(article)}
              >
                <h2 className="font-semibold mt-2">{article.title}</h2>
                <hr className="my-4 bg-[#ccc]" />
                <Image
                  alt="image"
                  className="w-full h-[250px]"
                  src={`http://localhost:1000/${article.photo}`}
                  width={100}
                  height={100}
                />

                <div className="my-2 text-sm flex items-center gap-2">
                  <ClockCircleOutlined />
                  <p>{formatteDate(article.dateCreated)}</p>
                </div>
                <div className="text-[dodgerblue] flex items-center text-sm">
                  <AttachFileOutlined fontSize="16" />
                  <a href="google.com" target="__blank">
                    {article.url}
                  </a>
                </div>
                <p className="text-gray-400 text-sm">Fitness Center</p>
                <button
                  onClick={() => setread(true)}
                  className="mt-4 mb-2 bg-[#08a88a] text-white p-2 rounded-md w-full"
                >
                  Read
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center m-auto justify-center">
            <FrownOutlined />
            <p>No articles From Fintess Center Today</p>
          </div>
        )}
        <div className="mt-5">
          <h1 className="text-2xl py-1">My Trainer's Articles</h1>
          {trainerArticles ? (
            <div className="grid grid-cols-4">
              {trainerArticles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white p-4 rounded-lg shadow w-[300px]"
                  onClick={() => populateArticle(article)}
                >
                  <h2 className="font-semibold mt-2">{article.title}</h2>
                  <hr className="my-4 bg-[#ccc]" />
                  <Image
                    alt="image"
                    className="w-full h-[250px]"
                    src={`http://localhost:1000/${article.photo}`}
                    width={100}
                    height={100}
                  />

                  <div className="my-2 text-sm flex items-center gap-2">
                    <ClockCircleOutlined />
                    <p>{formatteDate(article.dateCreated)}</p>
                  </div>
                  <div className="text-[dodgerblue] flex items-center text-sm">
                    <AttachFileOutlined fontSize="16" />
                    <a href="google.com" target="__blank">
                      {article.url}
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm">Fitness Center</p>
                  <button
                    onClick={() => setread(true)}
                    className="mt-4 mb-2 bg-[#08a88a] text-white p-2 rounded-md w-full"
                  >
                    Read
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <FrownOutlined />
              <p>No articles From Fintess Center Today</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        centered
        open={read}
        footer={false}
        onCancel={() => setread(false)}
      >
        <div>
          <h1>Read Articel</h1>
          <p>{currentArticle?.desc}</p>
        </div>
        <div className="text-[dodgerblue] flex items-center text-sm">
          <AttachFileOutlined fontSize="16" />
          <a href="google.com" target="__blank">
            {currentArticle?.url}
          </a>
        </div>

        <button
          onClick={() => setread(false)}
          className="bg-[#08a88a] text-white py-2 px-4 rounded-lg items-center justify-center flex m-auto"
        >
          Done
        </button>
      </Modal>
    </div>
  )
}

export default Articles
