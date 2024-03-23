import { Table, Space, Popconfirm, Modal, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { toast, Toaster, ToastIcon } from "react-hot-toast";
import { ArrowRight, Assignment } from "@mui/icons-material";

const FitnessGoals = () => {
  const [goals, setgoals] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [goalField, setgoalField] = useState("");
  const [loading, setloading] = useState(false);

  // getting fitness id from the fitnessCenter
  let storedFitnessId;
  if (typeof sessionStorage !== "undefined") {
    storedFitnessId = sessionStorage.getItem("fitnessCenterId");
  }

  const handleAddGoal = async () => {
    try {
      setloading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        center_id: storedFitnessId,
        goal: goalField,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch(
        "http://localhost:1000/api/v1/admins/goal/create",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === " fitness goal created successfully") {
            toast.success(result.msg);
            console.log(result.msg);
            setloading(false);
            setAddModal(false);
            getGoal();
          } else {
            toast.error(result.msg);
            console.log(result.msg);
          }
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  const getGoal = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/center/${storedFitnessId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setgoals(result.center_goals);
          console.log(result.center_goals);
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  const hanldeDelete = async (goalId) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/delete/${goalId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "goal deleted successfully") {
            toast.success(result.msg);
            getGoal();
            console.log(result.msg);
          } else {
            toast.error(result.msg);
            console.log(result.msg);
          }
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGoal();
  }, []);

  const columns = [
    {
      title: "Goal",
      dataIndex: "goal",
      key: "goal",
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
            title="Delete the Member"
            description="Are you sure to delete Member?"
            onConfirm={() => hanldeDelete(record._id)}
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
    <div className="">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 flex rounded-lg items-center justify-center w-12 h-12">
          <Assignment color="white" className="text-white " />
        </div>
        <h1 className="text-2xl">Fitness Goal</h1>
      </div>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        <h1 className="font-semibold">Goals</h1>
      </p>
      <div className="flex gap-5 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="bg-[#fdfaf3] h-12 w-12 items-center justify-center flex rounded gap-5">
            <h1 className="text-2xl ">{goals ? goals.length : "0"}</h1>
          </div>
          <h1 className="text-2xl ">Fitness Goals</h1>
        </div>
        <div
          className="bg-[#08a88a] p-3 rounded text-white cursor-pointer flex items-center gap-1"
          onClick={() => setAddModal(true)}
        >
          <PlusOutlined />
          <h1>Add New Goal</h1>
        </div>
      </div>
      <div className="mt-10">
        <Table columns={columns} dataSource={goals} />
      </div>

      <Modal open={addModal} onCancel={() => setAddModal(false)} footer={false}>
        <div className=" items-center m-auto">
          <h1> Add New Goal </h1>
          <br />
          <h1 className="text-lg">Goal</h1>
          <Input
            placeholder="new goal"
            className="py-4"
            onChange={(e) => setgoalField(e.target.value)}
          />

          <div
            className="flex mt-5 bg-[#08a88a] w-full text-center text-white py-4 rounded-md justify-center cursor-pointer"
            onClick={() => handleAddGoal()}
          >
            <h1 className="text-center">
              {loading ? "Adding..." : "Add Goal"}
            </h1>
          </div>
        </div>
      </Modal>
      <Toaster />
    </div>
  );
};

export default FitnessGoals;
