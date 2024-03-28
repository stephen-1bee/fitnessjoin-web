"use client";
import { FrownOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";

const Session = () => {
  const [sessions, setSessions] = useState([]);

  // get user center id
  let userCenterId;

  if (typeof sessionStorage !== "undefined") {
    userCenterId = sessionStorage.getItem("userCenterId");
  }

  // get all center sessions
  const getSessions = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `https://fitness-join-api-xe62.onrender.com/api/v1/sessions/all/center/${userCenterId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setSessions(result.sessions);
          console.log(result.sessions);
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  // init
  useEffect(() => {
    getSessions();
  }, []);
  return (
    <div className="">
      <h1 className="text-2xl">My Session</h1>
      <br />
      {/* <Tag */}
      <div className="flex flex-col items-center gap-3 mt-5">
        <FrownOutlined />
        <p>No session assign to you yet</p>
      </div>
    </div>
  );
};

export default Session;
