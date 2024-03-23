"use client"
import React, { useEffect } from "react"
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  Space,
  Popconfirm,
  InputNumber,
} from "antd"
import { useState } from "react"
import { Add, CardMembership, ArrowRight } from "@mui/icons-material"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Toaster, toast } from "react-hot-toast"
import { Result } from "postcss"

const FitnessMembership = () => {
  const [addModal, setAddModal] = useState(false)
  const [UpdateModlaVisible, setUpdateModlaVisible] = useState(false)
  const [loading, setloading] = useState(false)
  const [allMemberships, setAllMemberships] = useState([])

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  const [updateName, updateSetName] = useState("")
  const [updatePrice, updateSetPrice] = useState("")

  // getting fitness id from the fitnessCenter
  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
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

  // update Membership
  const handleUpdateMembership = () => {}

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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => setUpdateModlaVisible(true)} />
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
              className="py-4 w-[50px] ring-1 ring-[#ccc] rounded-md px-3"
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
        <Form className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg">Name</h1>
            <Input
              onChange={(e) => updateName(e.target.value)}
              className="py-4"
            />
          </div>

          <div>
            <h1 className="text-lg">Price</h1>
            <input
              type="numeric"
              onChange={(e) => updatePrice(e.target.value)}
              className="py-4 w-[50px] ring-1 ring-[#ccc] rounded-md px-3"
            />
          </div>

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center  cursor-pointer"
            onClick={() => handleUpdateMembership()}
          >
            <h1 className="text-center">
              {loading ? "Upading..." : "Update Membersip"}
            </h1>
          </div>
        </Form>
      </Modal>
      <Toaster />
    </div>
  )
}

export default FitnessMembership
