import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons"
import { ArrowRight } from "@mui/icons-material"
import { Table, Modal, Form, Button, Input, Space, Popconfirm, Tag } from "antd"
import TextArea from "antd/es/input/TextArea"
import { Image } from "antd"
import React from "react"
import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import Link from "next/link"

const Articles = () => {
  const [addModal, setaddModal] = useState(false)
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")
  const [url, setUrl] = useState("")
  const [photo, setphoto] = useState("")
  const [loading, setloading] = useState(false)
  const [approvedArticles, setapprovedArticles] = useState([])
  const [pendingArticles, setpendingArticles] = useState([])

  // get trainer id
  let trainer_id
  let trainer_center_id
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId")
    trainer_center_id = sessionStorage.getItem("trainerCenterId")
  }

  // add article
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
      formdata.append("center_id", trainer_center_id)
      formdata.append("trainer_id", trainer_id)
      formdata.append("creator_type", "trainer")
      formdata.append("isApproved", false)

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
            getApprovedArticles()
            getPendingArticls()
            setaddModal(false)
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
  const handleDeletArticle = async (articleid) => {
    try {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/delete/${articleid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "article deleted successfully") {
            toast.success(result.msg)
            console.log(result)
            getApprovedArticles()
            getPendingArticls()
          } else {
            toast.error(result.msg)
          }
        })
        .catch((error) => console.log("error", error))
    } catch (err) {
      console.log(err)
    }
  }

  // get pending articles
  const getApprovedArticles = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/trainer/approved/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setapprovedArticles(result.approved_articles)
          console.log(result)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  // get pending articles
  const getPendingArticls = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/trainer/pending/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setpendingArticles(result.pending_articles)
          console.log(result.pending_articles)
        })
        .catch((error) => console.error(error))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getApprovedArticles()
    getPendingArticls()
  }, [])

  const column = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
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
  return (
    <div>
      <h1 className="text-3xl">Articles</h1>
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
            <h1>{approvedArticles.length}</h1>
          </div>
          <h1 className="text-lg font-semibold py-2">Approved Articles</h1>
        </div>
        {/* add new article */}
        <div
          className="flex p-3 bg-[#08a88a] text-white  cursor-pointer items-center justify-center rounded-md gap-2 w-fit"
          onClick={() => setaddModal(true)}
        >
          <PlusOutlined />
          <p>Add New Article</p>
        </div>
      </div>
      <Table columns={column} dataSource={approvedArticles} />
      <div className="mt-10">
        <div className="flex gap-3 py-4">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1>{pendingArticles ? pendingArticles.length : "0"}</h1>
          </div>
          <h1 className="text-lg font-semibold py-2">Pending Articles</h1>
        </div>
        <Table columns={column} dataSource={pendingArticles} />
      </div>
      {/* add article modal */}
      <Modal
        title="Add Article"
        open={addModal}
        onCancel={() => setaddModal(false)}
        footer={[false]}
      >
        <Form className="flex flex-col gap-3">
          <input
            type="file"
            onChange={(e) => setphoto(e.target.files[0])}
            className="py-4"
          />

          <h1 className="text-lg">Title</h1>
          <Input onChange={(e) => settitle(e.target.value)} className="py-4" />

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
      {/* <Modal
        title="Add Article"
        open={addModal}
        onCancel={() => setaddModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setaddModal(false)}>
            Cancel
          </Button>,
          <Button
            className="bg-[#08a88a] "
            key="submit"
            type="primary"
            onClick={() => handleAddArticle()}
          >
            {loading ? "Adding..." : "Add Article"}
          </Button>,
        ]}
      >
        <Form>
          <input
            type="file"
            onChange={(e) => setphoto(e.target.files[0])}
            className="mb-5"
          />
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, type: "text" }]}
          >
            <Input onChange={(e) => settitle(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
            rules={[{ required: true, type: "text" }]}
          >
            <TextArea
              rows={4}
              placeholder="Description"
              onChange={(e) => setdesc(e.target.value)}
            />
          </Form.Item>
        </Form>
        <Toaster />
      </Modal> */}
      <Toaster />
    </div>
  )
}

export default Articles
