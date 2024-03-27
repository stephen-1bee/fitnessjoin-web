import React, { useState, useEffect } from "react"
import { Button, Space, Popconfirm, Modal, Input, Form, Table, Tag } from "antd"
import Image from "next/image"
import {
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReadOutlined,
  LinkOutlined,
} from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { Toaster, toast } from "react-hot-toast"
import { ArrowRight } from "@mui/icons-material"
import { Link } from "@mui/material"

const FitnessArticles = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [UpdateModlaVisible, setUpdateModlaVisible] = useState(false)
  const [loading, setloading] = useState(false)
  const [fitnessArticles, setAllFitnessArticles] = useState([])
  const [trainerArticles, settrainerArticles] = useState([])

  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")
  const [photo, setphoto] = useState("")
  const [url, setUrl] = useState("")

  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  const deleteCancel = (e) => {
    console.log(e)
  }

  const handleAddArticle = async () => {
    if (!title || !desc || !url || !photo) {
      return toast.error("All field are required")
    }
    try {
      setloading(true)
      var formdata = new FormData()
      formdata.append("photo", photo)
      formdata.append("title", title)
      formdata.append("url", url)
      formdata.append("desc", desc)
      formdata.append("center_id", storedFitnessId)
      formdata.append("isApproved", true)
      formdata.append("creator_type", "center")

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }

      await fetch(
        "http://localhost:1000/api/v1/articles/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "article added successfully") {
            toast.success(result.msg)
            setloading(false)
            setIsModalVisible(false)
            getAllArticles()
          } else {
            toast.error(result.msg)
            setloading(false)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // delete article
  const handleDeletArticle = async (articleId) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/delete/${articleId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "article deleted successfully") {
            toast.success(result.msg)
            console.log(result)
            getAllArticles()
            getTrainerArticle()
            setIsModalVisible(false)
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // get all articles based on center id
  const getAllArticles = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      fetch(
        `http://localhost:1000/api/v1/articles/center-articles/${storedFitnessId}`,
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

  // articles from traier
  const getTrainerArticle = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/trainer-articles/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          settrainerArticles(result.trainer)
          console.log(result.trainer)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllArticles()
    getTrainerArticle()
  }, [])

  const handleToggleAcceptance = (articleId, isApproved) => {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
    }

    const endpoint = isApproved
      ? `http://localhost:1000/api/v1/articles/disapprove/${articleId}`
      : `http://localhost:1000/api/v1/articles/approve/${articleId}`

    fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        getTrainerArticle()
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  const column = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: photo,
      render: (_, photo) => (
        <div>
          {photo ? (
            <Image
              width={100}
              height={100}
              alt="article  image"
              src={`http://localhost:1000/${photo.photo}`}
              className="rounded-lg"
            />
          ) : (
            <Skeleton active />
          )}
        </div>
      ),
    },
    {
      title: "Article Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <div>
          {url ? (
            <Link href={url} className="flex gap-1 items-center cursor-pointer">
              <LinkOutlined />
              {url}
            </Link>
          ) : (
            "no url"
          )}
        </div>
      ),
    },
    {
      title: "Decription",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "red"}>
          {isApproved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => setUpdateModlaVisible(true)} />
          <Popconfirm
            title="Delete the Article"
            description="Are you sure to delete Article?"
            onConfirm={() => handleDeletArticle(record._id)}
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

  const columnT = [
    {
      title: "From",
      render: (_, record) => (
        <div>
          <p>{record.trainer[0].name}</p>
        </div>
      ),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: photo,
      render: (_, photo) => (
        <div>
          {photo ? (
            <Image
              width={100}
              height={100}
              alt="article  image"
              src={`http://localhost:1000/${photo.photo}`}
              className="rounded-lg"
            />
          ) : (
            <Skeleton active />
          )}
        </div>
      ),
    },
    {
      title: "Article Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Decription",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "red"}>
          {isApproved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => setIsEdithModal(true)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete article"
            description="Are you sure to delete Trainer's Article?"
            onConfirm={() => handleDeletArticle(record._id)}
            onCancel={deleteCancel}
            okText="Delete"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
          <button
            className="text-white w-[100px] rounded-full py-3 bg-[#08a88a]"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              handleToggleAcceptance(record._id, record.isApproved)
            }
          >
            {record.isApproved ? "Withdraw" : "Approve"}
          </button>
        </Space>
      ),
    },
  ]
  return (
    <div className="min-h-screen">
      <div className="flex gap-2 items-center">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <ReadOutlined className="text-white text-lg" />
        </div>
        <h1 className="text-2xl">Articles</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Articles
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1 className="text-lg">
              {fitnessArticles ? fitnessArticles.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl font-semibold py-2">My Articles</h1>
        </div>
        {/* add new article */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setIsModalVisible(true)}
        >
          <PlusOutlined />
          <p>Add New Article</p>
        </div>
      </div>

      <div>
        {/* <Input.Search
          className="p-3 w-full outline-none "
          placeholder="Search Articles"
        /> */}
        <Table columns={column} dataSource={fitnessArticles} />
      </div>
      <div className="flex gap-2 py-3">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1 className="text-lg">
            {trainerArticles ? trainerArticles.length : "0"}
          </h1>
        </div>
        <h1 className="text-2xl  py-2">Affiliate Trainer Articles</h1>
      </div>
      <Table columns={columnT} dataSource={trainerArticles} />

      {isModalVisible ? (
        //  Add Modal
        <Modal
          title="Add Article"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[false]}
        >
          <Form className="flex flex-col gap-3">
            <input
              type="file"
              onChange={(e) => setphoto(e.target.files[0])}
              className="py-4"
            />

            <h1 className="text-lg">Title</h1>
            <Input
              onChange={(e) => settitle(e.target.value)}
              className="py-4"
            />

            <h1 className="text-lg">Url</h1>
            <Input
              placeholder="url"
              className="py-4"
              onChange={(e) => setUrl(e.target.value)}
            />

            <h1 className="text-lg">Description</h1>
            <TextArea
              rows={4}
              placeholder="Description"
              onChange={(e) => setdesc(e.target.value)}
            />

            <div
              className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
              onClick={() => handleAddArticle()}
            >
              <h1 className="text-center">
                {loading ? "Adding..." : "Add Article"}
              </h1>
            </div>
          </Form>
        </Modal>
      ) : null}

      {/* Update Modal */}
      <Modal
        title="Update Article"
        open={UpdateModlaVisible}
        onCancel={() => setUpdateModlaVisible(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-3">
          <input
            type="file"
            // onChange={(e) => setphoto(e.target.files[0])}
            className="py-4"
          />

          <h1 className="text-lg">Title</h1>
          <Input
            // onChange={(e) => settitle(e.target.value)}
            className="py-4"
          />

          <h1 className="text-lg">Url</h1>
          <Input
            placeholder="url"
            className="py-4"
            // onChange={(e) => setUrl(e.target.value)}
          />

          <h1 className="text-lg">Description</h1>
          <TextArea
            rows={4}
            placeholder="Description"
            // onChange={(e) => setdesc(e.target.value)}
          />

          <div className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer">
            <h1 className="text-center">
              {loading ? "Updating..." : "Update Article"}
            </h1>
          </div>
        </Form>
      </Modal>

      <Toaster />
    </div>
  )
}

export default FitnessArticles
