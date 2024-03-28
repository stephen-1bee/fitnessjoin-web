import React from "react";
import { FrownOutlined } from "@ant-design/icons";

const Articles = () => {
  return (
    <div className="mt-10">
      <h1 className="text-2xl">Articles</h1>
      <br />
      {/* <Tag */}
      <div className="flex flex-col items-center gap-3 mt-5">
        <FrownOutlined />
        <p>No Articles created yet </p>
      </div>
    </div>
  );
};

export default Articles;
