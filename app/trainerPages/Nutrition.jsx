import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ArrowRight } from "@mui/icons-material";
import { Table } from "antd";

const Nutrition = () => {
  return (
    <div>
      <h1 className="text-3xl">Nutritions</h1>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Nutition
      </p>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 py-2">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1>5</h1>
          </div>
          <h1 className="py-2 text-lg">Approved Nutritions</h1>
        </div>
        {/* add new article */}
        <div className="flex p-3 bg-[#08a88a] text-white items-center justify-center rounded-md gap-2 w-fit">
          <p>Generate Nutrition</p>
        </div>
      </div>
      <div>
        <div className="flex h-[12rem] w-[200px] bg-white p-3 flex-col shadow rounded">
          <p>Food:</p>
          <p>Category:</p>
        </div>
      </div>

      <div>
        <div className="flex gap-4 py-2 mt-5">
          <div className="h-12 w-12 bg-[#fdfaf3] items-center justify-center flex rounded shadow">
            <h1>5</h1>
          </div>
          <h1 className="py-2 text-lg">Pending Nutritions</h1>
        </div>
        <div className="flex h-[12rem] w-[200px] shadow-sm bg-white p-3 flex-col rounded">
          <p>Food:</p>
          <p>Category:</p>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
