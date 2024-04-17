import {
  Email,
  EmailOutlined,
  LocationOnOutlined,
  Message,
  Phone,
} from "@mui/icons-material"
import moment from "moment"
import React, { useEffect, useState } from "react"

const Center = () => {
  const [user, setUser] = useState(null)
  const [userCenter, setUserCenter] = useState(null)

  // retrieving user id
  let userId
  let userCenterId

  if (typeof sessionStorage !== "undefined") {
    userId = sessionStorage.getItem("userId")
    userCenterId = sessionStorage.getItem("userCenterId")
  }

  // console.log("User: ", user);
  console.log("User Center: ", userCenter)

  // get a user
  const getUser = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setUser(result.user)
          setUserCenter(result.user[0].fitness_center)
          console.log(result.user)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // get users center
  const getUsersCenter = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/admins/one/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setUserCenter(result.admin)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // load
  useEffect(() => {
    getUser()
    getUsersCenter()
  }, [])

  // format time
  const formattedTime = (time) => {
    return moment(time, "HH:mm:ss").format("hh:mm A")
  }

  return (
    <div>
      <h1 className="text-2xl">My Fitness Center Profile</h1>
      <br />

      <div className="w-fit">
        <div className="p-5 bg-[#08a88a] text-white rounded shadow-2xl md:flex-row flex  flex-col-reverse gap-5 w-fit">
          {userCenter ? (
            <div className="w-full">
              <h2 className="text-xl font-bold">
                {userCenter ? userCenter.name : null}
              </h2>
              <div className="text-white mt-2">
                {/* <Message/> */}
                {userCenter ? userCenter.desc : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <EmailOutlined />
                {userCenter ? userCenter.email : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <LocationOnOutlined />
                {userCenter ? userCenter.location : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <Phone />
                {userCenter ? userCenter.phone : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                Rating: {userCenter[0]?.rating ? userCenter[0]?.rating : "0"}
              </div>

              <h1>Working hours</h1>
              <div className="flex items-center gap-5">
                <div className="text-white gap-2 flex">
                  {userCenter[0]?.opening_time
                    ? formattedTime(userCenter[0]?.opening_time)
                    : "N/A"}
                </div>
                <div className="text-white  gap-2 flex">
                  {userCenter[0]?.closing_time
                    ? formattedTime(userCenter[0]?.closing_time)
                    : "N/A"}
                </div>
              </div>
            </div>
          ) : (
            "No Fitness Center"
          )}
        </div>
      </div>
      {/* <Tag */}
    </div>
  )
}

export default Center
