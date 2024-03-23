import { ArrowRight } from "@mui/icons-material";
import { Form, Input } from "antd";
import React from "react";

const Profile = () => {
  return (
    <div>
      <h1 className="text-3xl">Update Profile</h1>
      <Form className="flex mt-12 px-20 flex-col gap-4">
        <Input
          type="text"
          placeholder="firstname"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc] outline-[#08A88A]"
        />
        <Input
          type="text"
          placeholder="lastname"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc]"
        />
        <Input
          type="email"
          placeholder="email"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc]"
        />
        <Input.Password
          type="password"
          placeholder="password"
          className="py-4 w-[300px] px-3 rounded-full ring-1 ring-[#ccc]"
        />
        <button className="py-4 w-[300px] px-3 rounded-full ring-1 bg-[#08A88A] text-white">
          Save
        </button>
      </Form>
    </div>
  );
};

export default Profile;
