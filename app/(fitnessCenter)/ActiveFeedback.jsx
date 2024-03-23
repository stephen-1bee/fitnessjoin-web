"use client";
import { Button, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const ActiveFeedback = () => {
  return (
    <div className="bg-white w-[500px] p-4 rounded-lg shadow-md ">
      <div className="flex flex-col  items-start">
        <Tag color="cyan">User</Tag>
        <p className="py-2 px-5  text-[16px] mr-7">Hello boss..</p>
      </div>
      <div className="flex items-center justify-center mt-20">
        <TextArea
          placeholder="Reply user's messages"
          rows={5}
          className="outline-none"
        />
      </div>
      <Button className="items-center justify-end mt-3 flex">Submit</Button>
    </div>
  );
};

export default ActiveFeedback;
