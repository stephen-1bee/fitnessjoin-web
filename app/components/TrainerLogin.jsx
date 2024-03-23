import React, { useState } from "react";
import { Input, Select } from "antd";
import Image from "next/image";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Link from "next/link";

export const metadata = { title: "Trainer Login" };

const TrainerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [trainer_id, setTrainer_id] = useState("");
  const [trainerName, settrainerName] = useState("");

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("trainerId", trainer_id);
    sessionStorage.setItem("trainerName", trainerName);
  }

  let trainer_center_id;
  if (typeof sessionStorage !== "undefined") {
    trainer_center_id = sessionStorage.getItem("trainerCenterId");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All field are required");
    }
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: email,
        password: password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://fitness-join-api-xe62.onrender.com/api/v1/trainers/login",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "login successful") {
            toast.success(result.msg);
            console.log(result.msg);
            setLoading(false);
            location.href = "/trainerPage";
          } else {
            toast.error(result.msg);
            setLoading(false);
          }
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Image
        src="/logo.png"
        alt="logo"
        width={80}
        height={80}
        className="mb-3 m-auto"
      />
      <h1 className="text-center text-white text-2xl font-black">
        Trainer Login
      </h1>
      <form className="mt-5 flex flex-col bg-white p-8 trainer-login">
        <h1 className="mb-2 mt-3">Email</h1>
        <Input
          prefix={<UserOutlined />}
          className="w-[350px] h-12 rounded-full pl-5 outline-[#08a88a]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <h1 className="mb-2 mt-3">Password</h1>
        <Input.Password
          prefix={<LockOutlined />}
          className="w-[350px] h-12 pl-5 rounded-full outline-[#08a88a] "
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={(e) => handleLogin(e)}
          type="submit"
          className="px-7 py-4  bg-[#08a88a] rounded-full text-white mt-5"
        >
          {loading
            ? // <Image
              //   src="/loadin.gif"
              //   height={80}
              //   width={80}
              //   alt="loading"
              //   className="m-auto"
              // />
              "logging in"
            : "Login Now"}
        </button>
      </form>
      <div className="flex gap-5  mt-3 items-center justify-center ">
        <h1 className="text-[#f1f1f1] font-thin">
          Don't have an account?{" "}
          <Link href="/trainerSignup" className="text-[#08a88a] ml-1">
            Signup
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default TrainerLogin;
