"use client";
import { useState } from "react";
import Avatar from "antd/es/avatar/avatar";
import React from "react";
import ActiveFeedback from "./ActiveFeedback";

const FitnessFeedbacks = () => {
  const [activeItem, setactiveItem] = useState("");

  const handleActiveItem = (value) => {
    setactiveItem(value);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "ActiveFeedback":
        return (
          <div>
            <ActiveFeedback />
          </div>
        );
    }
  };
  return (
    <div className="flex gap-3">
      <br />
      <div className="flex gap-4">
        {/* feedback list */}
        <div className="bg-white p-5 rounded-lg shadow-md ">
          <h1 className="font-bold text-lg">Feedback List</h1>
          <div
            className="border-b border-[#ededed] hover:cursor-pointer pb-4 pt-4 "
            onClick={() => handleActiveItem("ActiveFeedback")}
          >
            <div className="flex gap-2 items-center">
              <Avatar size={40} />
              <h2 className="font-bold">Collin Ansah</h2>
            </div>
            <p className="text-[#818181]">
              Hello, please when is the weight loss session ending?
            </p>
          </div>
          <div className="border-b border-[#ededed] pb-4 pt-4">
            <h2 className="font-bold">Collin Ansah</h2>
            <p className="text-[#818181]">
              Hello, please when is the weight loss session ending?
            </p>
          </div>
        </div>
      </div>

      {/* details and replies */}
      <div className="p-2">{renderContent()}</div>
    </div>
  );
};

export default FitnessFeedbacks;
