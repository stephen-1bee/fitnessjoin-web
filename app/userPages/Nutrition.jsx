import React from "react";
import { FrownOutlined } from "@ant-design/icons";

const Nutrition = () => {
  return (
    <div>
      <h1 className="text-2xl">My Nutrition</h1>
      <br />
      <div className="flex flex-col items-center gap-3 mt-5">
        <FrownOutlined />
        <p>No Nutrition assigned to you yet</p>
      </div>
    </div>
  );
};

export default Nutrition;
