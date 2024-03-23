import { PlusOutlined } from "@ant-design/icons";
import { ArrowRight } from "@mui/icons-material";
import { Table } from "antd";
import React from "react";

const Users = () => {
  const column = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} />
          <EyeOutlined onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Delete the Member"
            description="Are you sure to delete Member?"
            onConfirm={() => deleteUser(record._id)}
            onCancel={deleteCancel}
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
      <h1 className="text-3xl">Users</h1>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Users
      </p>
      <div className="flex items-center justify-between mb-5">
        <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
          <h1>5</h1>
        </div>
        {/* add new user */}
        <div className="flex p-3 bg-[#08a88a] text-white items-center justify-center rounded-md gap-2 w-fit">
          <PlusOutlined />
          <p>Add User</p>
        </div>
      </div>
      <Table columns={column} />
    </div>
  );
};

export default Users;
