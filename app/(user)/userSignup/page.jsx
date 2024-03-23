"use client";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { EmailOutlined } from "@mui/icons-material";
import Link from "next/link";

const UserSignup = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [goal, setGoal] = useState([]);
  const [goalField, setgoalField] = useState("");
  const [telephone, setTelephone] = useState("");

  let user_center_id;
  let membershipId;
  if (typeof sessionStorage !== "undefined") {
    user_center_id = sessionStorage.getItem("userCenterId");
    membershipId = sessionStorage.getItem("membershipId");
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !telephone || !location) {
      return toast.error("All fields are required");
    }
    try {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone: telephone,
        goal: goalField,
        membership_id: membershipId,
        center_id: user_center_id,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("http://localhost:1000/api/v1/users/create", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "user created successfully") {
            toast.success(result.msg);
            console.log(result);
            setLoading(false);
            location.href = "/userLogin";
          } else {
            toast.error(result.msg);
            setLoading(false);
          }
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  const getFitnessGoals = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/admins/goal/center/${user_center_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setGoal(result.center_goals);
          console.log(result.center_goals);
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFitnessGoals();
  }, []);

  // console.log(`Goal: ${goal.goa}`);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen m-auto home">
      <Image src="/logo.png" alt="logo" width={70} height={70} className="" />
      <h1 className="text-2xl my-2 font-bold text-white">User Signup</h1>
      <form className="flex flex-col gap-2 bg-white py-7 px-8 myForm">
        <h1>First name</h1>
        <Input
          prefix={<UserOutlined className="scale-x-[-1]" />}
          placeholder="first name"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <h1>Last name</h1>
        <Input
          prefix={<UserOutlined className="scale-x-[-1]" />}
          placeholder="last name"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setLastName(e.target.value)}
        />

        <h1>Email</h1>
        <Form.Item rules={[{ required: true, type: "email" }]}>
          <Input
            prefix={<EmailOutlined className="scale-x-[-1]" />}
            placeholder="user@gmail.com"
            className="w-[350px] h-12 rounded-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <h1>Password</h1>
        <Input.Password
          placeholder="password"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <h1>Phone</h1>
        <Input
          prefix={<PhoneOutlined className="scale-x-[-1]" />}
          placeholder="233-4903-93094"
          className="w-[350px] h-12 rounded-full"
          onChange={(e) => setTelephone(e.target.value)}
        />

        <h1>Choose a goal</h1>
        <Select
          placeholder="Select a goal from this fitness center"
          className="w-[350px] rounded-full h-[25px]"
          onChange={(e) => setGoal(e.value)}
          options={goal?.map((g) => ({
            value: g.goal,
            lable: g.goal,
          }))}
        />
        {/* <Input
          placeholder="Select a goal from this fitness center"
          className="w-[350px] rounded-full h-12"
          onChange={(e) => setGoal(e.target.value)}
        /> */}
        <button
          onClick={(e) => handleSignUp(e)}
          type="submit"
          className="px-7 py-4  bg-[#08A88A] rounded-full text-white mt-5"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-5  mt-2 items-center justify-center ">
        <h1 className="text-[#f1f1f1] font-thin">
          Already have an account?{" "}
          <Link href="/userLogin" className="text-[#08a88a]">
            Login
          </Link>
        </h1>
      </div>
      <Toaster />
    </div>
  );
};

export default UserSignup;
