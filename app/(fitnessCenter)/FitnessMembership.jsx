"use client"
import React, { useEffect } from "react"
import { Modal, Form, Input, Table, Space, Popconfirm } from "antd"
import { useState } from "react"
import { CardMembership, ArrowRight } from "@mui/icons-material"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Toaster, toast } from "react-hot-toast"
import moment from "moment"

const FitnessMembership = () => {
  const [addModal, setAddModal] = useState(false)
  const [UpdateModlaVisible, setUpdateModlaVisible] = useState(false)
  const [loading, setloading] = useState(false)
  const [allMemberships, setAllMemberships] = useState([])

  // state to add new membership
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  // state to update new membership
  const [updateName, setupdateSetName] = useState("")
  const [updatePrice, setupdateSetPrice] = useState("")

  // state to hold current membership
  const [currentMembership, setcurrentMembership] = useState(null)

  const populateMembership = (info) => {
    setcurrentMembership(info)
    setUpdateModlaVisible(true)
  }

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }

  // Add memberships
  const handleAddMembership = async () => {
    if (!name || !price) {
      return toast.error("All fields are required")
    }
    try {
      setloading(true)
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        name: name,
        price: price,
        center_id: storedFitnessId,
      })

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/memberships/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "membership added successfully") {
            toast.success(result.msg)
            setName(null)
            getMemberships()
            setAddModal(false)
            console.log(result)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  const membershipId = currentMembership?._id

  // update Membership
  const handleUpdateMembership = (membershipId) => {
    try {
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        name: updateName ? updateName : currentMembership?.name,
        price: updatePrice ? updatePrice : currentMembership?.price,
      })

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/memberships/update/${membershipId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "membership updated successfully") {
            toast.success(result.msg)
            console.log(result)
            setUpdateModlaVisible(false)
            getMemberships()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // Delete Membership
  const handleDleteMembership = (membershipid) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/memberships/delete/${membershipid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "membership deleted successfully") {
            toast.success(result.msg)
            getMemberships()
            console.log(result)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // get all memberships
  const getMemberships = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/memberships/all/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setAllMemberships(result.center_memberships)
          console.log("Memberships ", result.center_memberships)
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMemberships()
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (date) => formatteDate(date),
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      key: "dateUpdated",
      render: (date) => formatteDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => populateMembership(record)} />
          <Popconfirm
            title="Delete the Membership"
            description="Are you sure to delete Membership?"
            onConfirm={() => handleDleteMembership(record._id)}
            okText="Delete"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-2">
        <div className="bg-[#183642] flex rounded-lg items-center justify-center w-12 h-12">
          <CardMembership color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Membership Plan</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        <h1 className="font-semibold">Memberships</h1>
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {allMemberships ? allMemberships?.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl  py-2"> Memberships</h1>
        </div>
        {/* add new Membership */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setAddModal(true)}
        >
          <PlusOutlined />
          <h1>Add New Plan</h1>
        </div>
      </div>

      <Table columns={columns} dataSource={allMemberships} />

      {/* Add Memberships modal */}
      <Modal
        open={addModal}
        title="Add Membership Plan"
        onCancel={() => setAddModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg">Name</h1>
            <Input onChange={(e) => setName(e.target.value)} className="py-4" />
          </div>

          <div>
            <h1 className="text-lg">Price</h1>
            <input
              type="numeric"
              onChange={(e) => setPrice(e.target.value)}
              className="py-4 w-full ring-1 ring-[#ccc] rounded-md px-3"
            />
          </div>

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center  cursor-pointer"
            onClick={() => handleAddMembership()}
          >
            <h1 className="text-center">
              {loading ? "Adding..." : "Add Membersip"}
            </h1>
          </div>
        </Form>
      </Modal>

      {/* Update Memberships modal */}
      <Modal
        open={UpdateModlaVisible}
        title="Update Membership Plan"
        onCancel={() => setUpdateModlaVisible(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-4" key={currentMembership?._id}>
          <div>
            <h1 className="text-lg">Name</h1>
            <Input
              defaultValue={currentMembership?.name}
              onChange={(e) => setupdateSetName(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Price</h1>
            <input
              defaultValue={currentMembership?.price}
              type="numeric"
              onChange={(e) => setupdateSetPrice(e.target.value)}
              className="py-4 w-full ring-1 ring-[#ccc] rounded-md px-3"
            />
          </div>

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center  cursor-pointer"
            onClick={() => handleUpdateMembership(membershipId)}
          >
            <h1 className="text-center">Update Membersip</h1>
          </div>
        </Form>
      </Modal>
      <Toaster />
    </div>
  )
}

export default FitnessMembership
