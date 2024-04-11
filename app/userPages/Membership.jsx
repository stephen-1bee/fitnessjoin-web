"use client"
import { Spin } from "antd"
import React, { useEffect, useState } from "react"
import { FrownOutlined } from "@ant-design/icons"

const Membership = () => {
  const [user, setUser] = useState(null)
  const [fitnessMemberships, setfitnessMemberships] = useState([])
  const [loading, setLoading] = useState(false)
  const [userMembership, setUserMembership] = useState(null)

  // retrieving user id
  let userId
  let user_center_id
  if (typeof sessionStorage !== "undefined") {
    userId = sessionStorage.getItem("userId")
    user_center_id = sessionStorage.getItem("userCenterId")
  }

  const handleUpdateMembership = async (membershipId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      const raw = JSON.stringify({
        membership_id: membershipId,
      })
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
      fetch(
        `http://localhost:1000/api/v1/trainers/subscribe/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "membership subscribed successfully") {
            toast.success("Membership Updated successfully")
            console.log(result)
            getUser()
            getFitnessMemberships()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get a user
  const getUser = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      }

      let response = await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        {
          method: "GET",
          headers: headersList,
        }
      )

      let data = await response.json()
      setUser(data.user)
      console.log(data.user)
      console.log(data.user)
      setUserMembership(data.user[0]?.membership)
      console.log(data.user[0]?.membership)
    } catch (err) {
      console.log(err)
    }
  }

  const getFitnessMemberships = async () => {
    try {
      setLoading(true)
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/memberships/all/center/${user_center_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setfitnessMemberships(result.center_memberships)
          // console.log(`fitness ${result.center_memberships}`);
          setLoading(false)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // load
  useEffect(() => {
    getUser()
    getFitnessMemberships()
  }, [])

  return (
    <div>
      <div className="flex  gap-10 flex-col">
        {/* <Tag */}
        <div className="w-fit">
          <h1 className="text-2xl py-2">My Membership</h1>
          <div className="p-5 bg-[dodgerblue] text-white rounded shadow-2xl md:flex-row flex w-[200px] flex-col-reverse gap-5 ">
            {userMembership ? (
              <div className="w-full">
                <h2 className="text-xl font-bold">
                  {userMembership ? userMembership[0]?.name : null}
                </h2>
                <div className="text-white mt-2">
                  {/* <Message/> */}
                  <p>
                    <span className="text-sm">GHS </span>
                    <span className="font-bold text-xl">
                      {userMembership ? userMembership[0]?.price : null}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 flex-col items-center m-auto">
                <FrownOutlined className="m-auto" />
                <h1>No Membersip</h1>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-2xl"> Other Memberships </h1>
          <div className=" flex-col flex gap-5">
            {loading ? (
              <Spin />
            ) : fitnessMemberships === 0 ? (
              <div>
                <FrownOutlined className="text-white" />
                <p className="text-white">No memberships at this time</p>
              </div>
            ) : (
              fitnessMemberships.map((memberhip) => (
                <div className="flex flex-col p-5 gap-2 rounded-lg ring-1 shadow w-[200px] ">
                  <div>
                    <p>{memberhip.name}</p>
                    <p>{memberhip.price}</p>
                  </div>
                  <button
                    onClick={() => handleUpdateMembership(memberhip._id)}
                    className="flex  bg-[#08a88a] px-3 justify-end rounded-full py-3 w-fit text-white"
                  >
                    Register
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Membership
