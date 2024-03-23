import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Modal, Popconfirm, Space, Table } from "antd";
import React, { useState, useEffect } from "react";
import { ArrowRight, BroadcastOnPersonal } from "@mui/icons-material";
import { toast, Toaster } from "react-hot-toast";

const Broadcast = () => {
  const [addModal, setAddModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [message, setMessage] = useState("");

  console.log(message);

  // getting fitness id from the fitnessCenter
  let storedFitnessId;
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId");
  }

  const getNotification = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/notifications/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setNotification(result.center_notification);
          console.log(result.center_notification);
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  const handleAddNotification = async () => {
    try {
      setloading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        center_id: storedFitnessId,
        message: message,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch(
        "http://localhost:1000/api/v1/notifications/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification sent successfully") {
            toast.success(result.msg);
            console.log(result.msg);
            setloading(true);
            setAddModal(false);
            getNotification();
          } else {
            toast.error(result.msg);
            setAddModal(false);
          }
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (notificationId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(
        `http://localhost:1000/api/v1/notifications/delete/${notificationId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "notification deleted successfully") {
            toast.success(result.msg);
            console.log(result);
            getNotification();
          } else {
            toast.error(result.msg);
          }
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };
  const columns = [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined />
          <Popconfirm
            title="Delete the Notification"
            description="Are you sure to delete notifcation?"
            onConfirm={() => handleDelete(record._id)}
            // onCancel={deleteCancel}
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
  ];

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <BroadcastOnPersonal color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">My Broadcasts</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>
        <h1 className="font-semibold">Broadcast</h1>
      </p>
      <div className="flex gap-5 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="bg-[#fdfaf3] h-12 w-12 items-center justify-center flex rounded gap-5">
            <h1 className="text-2xl ">
              {notification ? notification.length : "0"}
            </h1>
          </div>
          <h1 className="text-2xl ">Fitness Broadcast</h1>
        </div>
        <div
          className="bg-[#08a88a] p-3 rounded text-white cursor-pointer flex items-center gap-1"
          onClick={() => setAddModal(true)}
        >
          <PlusOutlined />
          <h1>Add New Broadcast</h1>
        </div>
      </div>
      <div className="mt-10">
        <Table columns={columns} dataSource={notification} />
      </div>
      <Modal open={addModal} onCancel={() => setAddModal(false)} footer={false}>
        <div className=" items-center m-auto">
          <h1> Post Notification </h1>
          <br />
          <h1 className="text-lg">Notification</h1>
          <Input
            placeholder="message"
            className="py-4"
            onChange={(e) => setMessage(e.target.value)}
          />

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            onClick={() => handleAddNotification()}
          >
            <h1 className="text-center">
              {loading ? "Adding..." : "Add Broadcast"}
            </h1>
          </div>
        </div>
      </Modal>
      <Toaster />
    </div>
  );
};

export default Broadcast;
