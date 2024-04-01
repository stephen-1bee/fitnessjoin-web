import React, { useState, useEffect } from "react"
import {
  Space,
  Popconfirm,
  Modal,
  Input,
  Form,
  Table,
  Tag,
  Skeleton,
} from "antd"
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
import moment from "moment"

const FitnessArticles = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [UpdateModlaVisible, setUpdateModlaVisible] = useState(false)
  const [loading, setloading] = useState(false)
  const [fitnessArticles, setAllFitnessArticles] = useState([])
  const [trainerArticles, settrainerArticles] = useState([])
  const [isViewModal, setisViewModal] = useState(false)

  // state to add new article
  const [title, settitle] = useState("")
  const [desc, setdesc] = useState("")
  const [photo, setphoto] = useState("")
  const [url, setUrl] = useState("")

  // state to update article fields
  const [updateTitle, setupdateTitle] = useState("")
  const [updateDesc, setupdateDesc] = useState("")
  const [updatePhoto, setupdatePhoto] = useState("")
  const [updateUrl, setupdateUrl] = useState("")

  // state to hold current article
  const [currentArticle, setcurrentArticle] = useState(null)

  // function to populate current article fields
  const populateArticle = (info) => {
    setcurrentArticle(info)
    setUpdateModlaVisible(true)
  }

  let storedFitnessId
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId")
  }

  // formatt date
  const formatteDate = (date) => {
    return moment(date).format("dddd, MMMM D, YYYY")
  }


  // add article api int
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

  // get current article id
  const articleId = currentArticle?._id

  const handleUpdateArticle = async (articleId) => {
    try {
      const formdata = new FormData()
      formdata.append(
        "photo",
        updatePhoto ? updatePhoto : currentArticle?.photo
      )
      formdata.append(
        "title",
        updateTitle ? updateTitle : currentArticle?.updateTitle
      )
      formdata.append("desc", updateDesc ? updateDesc : currentArticle?.desc)
      formdata.append("url", updateUrl ? updateUrl : currentArticle?.url)

      const requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow",
      }

      await fetch(
        `http://localhost:1000/api/v1/articles/update/${articleId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "article updated successfully") {
            toast.success(result.msg)
            console.log(result)
            setUpdateModlaVisible(false)
            getAllArticles()
            getTrainerArticle()
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
          <EditOutlined onClick={() => populateArticle(record)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
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
      title: "Title",
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
          <EditOutlined onClick={() => populateArticle(record)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete article"
            description="Are you sure to delete Trainer's Article?"
            onConfirm={() => handleDeletArticle(record._id)}
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

  // state to preview article details
  const [articlePreview, setarticlePreview] = useState([])

  // handle Preview
  const handlePreview = (info) => {
    setarticlePreview(info)
    setisViewModal(true)
  }

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
          <img
            src={`http://localhost:1000/${currentArticle?.photo}`}
            className="w-20 h-20 rounded-md"
            alt="Preview"
          />
          <input
            type="file"
            onChange={(e) => setupdatePhoto(e.target.files[0])}
            className="py-4"
          />

          <h1 className="text-lg">Title</h1>
          <Input
            defaultValue={currentArticle?.title}
            onChange={(e) => setupdateTitle(e.target.value)}
            className="py-4"
          />

          <h1 className="text-lg">Url</h1>
          <Input
            defaultValue={currentArticle?.url}
            placeholder="url"
            className="py-4"
            onChange={(e) => setupdateUrl(e.target.value)}
          />

          <h1 className="text-lg">Description</h1>
          <TextArea
            defaultValue={currentArticle?.desc}
            rows={4}
            placeholder="Description"
            onChange={(e) => setupdateDesc(e.target.value)}
          />

          <div
            onClick={() => handleUpdateArticle(articleId)}
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
          >
            <h1 className="text-center">Update Article</h1>
          </div>
        </Form>
      </Modal>

      {/* preview */}
      <Modal
        title="User Preview"
        open={isViewModal}
        onCancel={() => setisViewModal(false)}
        footer={false}
      >
        <div>
          <div>
            {articlePreview.photo ? (
              <Image
                width={100}
                height={100}
                alt="article  image"
                src={`http:/localhost:1000/${articlePreview.photo}`}
                className="rounded-lg"
              />
            ) : (
              "no image"
            )}
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Title:</h1>
            <p>{articlePreview.title}</p>
          </div>
          <br />

          <div className="flex flex-col gap-1">
            <h1 className="font-bold">url:</h1>
            <p>{articlePreview.url}</p>
          </div>
          <br />

          <div className="flex gap-1 flex-col">
            <h1 className="font-bold">Short note:</h1>
            <p>{articlePreview.desc}</p>
          </div>
          <br />
          <h1 className="font-bold">Date Created:</h1>
          <p>{formatteDate(articlePreview.dateCreated)}</p>
        </div>
        <div className="border-b border-[#ccc] border-1 mt-2 " />
        <br />
        <div className="flex gap-1 flex-col">
          <h1 className="font-bold">Date Updated:</h1>
          <p>{formatteDate(articlePreview.dateUpdated)}</p>
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}

export default FitnessArticles
