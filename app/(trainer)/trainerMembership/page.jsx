"use client";
import { FrownOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export const Page = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user center id
  let trainerCenter_id;

  if (typeof sessionStorage !== "undefined") {
    trainerCenter_id = sessionStorage.getItem("trainerCenterId");
  }

  // get all memberships by membership id
  const getMemberships = async () => {
    try {
      setLoading(true);
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/memberships/all/center/${trainerCenter_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          setMemberships(result.center_memberships);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  // handle register for membership
  const applyMembership = (membership_id) => {
    try {
      toast.success(`Membership selected`);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("membershipId", membership_id);
      }
      setTimeout(() => {
        location.href = "/trainerSignup";
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  // initialize
  useEffect(() => {
    getMemberships();
  }, []);
  return (
    <div className="home min-h-screen flex flex-col gap-7 items-center justify-center">
      <div className="flex items-center flex-col">
        <h1 className="font-bold text-white text-4xl">
          Available Memberships?
        </h1>
        <p className="text-white">Choose a plan that works best for you</p>
      </div>
      <div className="flex gap-4">
        {loading ? (
          <p className="text-white">Loading available memberships...</p>
        ) : memberships.length === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <FrownOutlined className="text-white" />
            <p className="text-white">No memberships at this time</p>
          </div>
        ) : (
          memberships.map((membership) => (
            <div
              className="border-[1px] border-white p-8 rounded-lg w-[200px] py-6 h-[30vh] flex flex-col items-center justify-center gap-3 cursor-pointer m-box hover:bg-white"
              onClick={() => applyMembership(membership._id)}
            >
              <h2 className="text-white text-4xl font-bold">
                <span className="text-sm">GHS</span>
                {membership.price}
              </h2>
              <p className="text-white">{membership.name.toUpperCase()}</p>
            </div>
          ))
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Page;
