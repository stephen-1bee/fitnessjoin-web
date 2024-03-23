"use client";
import React from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { useState, useEffect } from "react";
import { CardMembership, CategoryOutlined } from "@mui/icons-material";

const FitnessDashboard = () => {
  const [memberships, setMemberships] = useState([]);
  const [session, setSession] = useState([]);
  const [trainer, setTrainer] = useState([]);
  const [users, setUser] = useState([]);

  const data = [
    { name: "Sessions", value: session?.length },
    { name: "Trainer", value: trainer?.length },
    { name: "Users", value: users.length },
    { name: "Memberships", value: memberships.length },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // retieve fitness center id
  let storedCenterId;
  if (typeof sessionStorage !== "undefined") {
    storedCenterId = sessionStorage.getItem("fitnessCenterId");
  }

  // Membership logic
  const getMembership = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `http://localhost:1000/api/v1/dashboard/allMembership/${storedCenterId}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      setMemberships(data.allMembership);
      console.log(data.allMembership);
    } catch (err) {
      console.log(err);
    }
  };
  // rendering the Api once
  useEffect(() => {
    getMembership();
  }, []);

  // get all Session
  const getSession = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `http://localhost:1000/api/v1/dashboard/allSessions/${storedCenterId}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      setSession(data.allSession);
      console.log(data.allSession);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  // Get all trainers
  const geTrainer = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `http://localhost:1000/api/v1/dashboard/allTrainers/${storedCenterId}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data);
      setTrainer(data.allTrainers);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    geTrainer();
  }, []);

  // get all Users Logic
  const getUser = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `http://localhost:1000/api/v1/dashboard/allUsers/${storedCenterId}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      setUser(data.allUsers);
      console.log(data.allUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const MyResponsivePie = ({ data /* see data tab */ }) => (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "ruby",
          },
          id: "dots",
        },
        {
          match: {
            id: "c",
          },
          id: "dots",
        },
        {
          match: {
            id: "go",
          },
          id: "dots",
        },
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
        {
          match: {
            id: "lisp",
          },
          id: "lines",
        },
        {
          match: {
            id: "elixir",
          },
          id: "lines",
        },
        {
          match: {
            id: "javascript",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );

  return (
    <div className="flex justify-center gap-5">
      {/* Canvas */}
      <div className="bg-white w-[500px] mr-12 p-12  items-center shadow-lg rounded-lg">
        <PieChart width={800} height={400}>
          <Pie
            className="text-center"
            data={data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={10}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      {/* Statistics */}
      <div className="flex flex-wrap gap-5">
        {/* session */}
        <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
          <div className="flex bg-orange-100 rounded-full p-5 text-left">
            <CategoryOutlined className="text-[18px]" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-center text-2xl">
              {session ? session?.length : "0"}
            </p>
            {session?.length === 1
              ? "Session"
              : session?.length <= 0
              ? "No Sessions"
              : "Sessions"}
          </div>
        </div>
        {/* TRAINERS */}
        <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
          <div className="flex bg-green-100 rounded-full p-5 text-left">
            <CardMembership className="text-[18px]" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-center text-2xl">
              {trainer ? trainer.length : "0"}
            </p>
            {trainer.length === 1
              ? "Trainer"
              : trainer.length <= 0
              ? "No Trainers"
              : "Trainers"}
          </div>
        </div>
        {/* MEMBERSHIP */}
        <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
          <div className="flex bg-green-100 rounded-full p-5 text-left">
            <CardMembership className="text-[18px]" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-center text-2xl">
              {memberships ? memberships.length : null}
            </p>
            {memberships.length === 1
              ? "Membership"
              : memberships.length <= 0
              ? "No Memberships"
              : "Memberships"}
          </div>
        </div>
        {/*  USERS */}
        <div className="flex w-[250px] items-center justify-between px-12  h-[150px] shadow-lg rounded-lg bg-white">
          <div className="flex bg-blue-100 rounded-full p-5 text-left">
            <CardMembership className="text-[18px]" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-center text-2xl">
              {users ? users.length : null}
            </p>
            {users.length === 1
              ? "User"
              : users.length <= 0
              ? "No Users"
              : "Users"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessDashboard;
