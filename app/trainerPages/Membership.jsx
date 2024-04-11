import React, { useEffect, useState } from "react"
import { ArrowRight } from "@mui/icons-material"
import { FrownOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import { toast, Toaster } from "react-hot-toast"

const Membership = () => {
  const [trainer, setTrainer] = useState(null)
  const [trainerMembership, setTrainerMembership] = useState(null)
  const [fitnessMemberships, setfitnessMemberships] = useState([])
  const [loading, setLoading] = useState(false)

  // get trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
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
        `http://localhost:1000/api/v1/trainers/subscribe/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "membership subscribed successfully") {
            toast.success("Membership Updated successfully")
            console.log(result)
            getTrainer()
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

  const getTrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/trainers/one/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainer(result.trainer)
          console.log(result.trainer)
          setTrainerMembership(result.trainer[0]?.membership)

          console.log(result.trainer[0]?.membership)
        })
        .catch((error) => console.error(error))
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
        `http://localhost:1000/api/v1/memberships/all/center/${trainer_center_id}`,
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

  useEffect(() => {
    getTrainer()
    getFitnessMemberships()
  }, [])

  return (
    <div>
      <h1 className="text-3xl">Membership</h1>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Memberhsip
      </p>
      <br />
      <div className="flex gap-10  flex-col">
        <div className="w-fit gap-5 flex flex-col">
          <h1 className="text-2xl">My Membership</h1>
          <div className="p-5 bg-[dodgerblue] text-white rounded shadow-2xl md:flex-row flex w-[200px] flex-col-reverse gap-5 ">
            {trainerMembership ? (
              <div className="w-full">
                <h2 className="text-xl font-bold">
                  {trainerMembership ? trainerMembership[0]?.name : null}
                </h2>
                <div className="text-white mt-2">
                  {/* <Message/> */}
                  <p>
                    <span className="text-sm">GHS </span>
                    <span className="font-bold text-xl">
                      {trainerMembership ? trainerMembership[0]?.price : null}
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
                <div className="flex-1 p-4 rounded-lg ring-1 gap-2 shadow w-[200px] ">
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
      <Toaster />
    </div>
  )
}

export default Membership
