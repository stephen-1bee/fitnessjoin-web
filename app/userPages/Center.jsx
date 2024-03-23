import {
  Email,
  EmailOutlined,
  LocationOnOutlined,
  Message,
  Phone,
} from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Center = () => {
  const [user, setUser] = useState(null);
  const [userCenter, setUserCenter] = useState(null);

  // retrieving user id
  let userId;

  if (typeof sessionStorage !== "undefined") {
    userId = sessionStorage.getItem("userId");
  }

  // console.log("User: ", user);
  console.log("User Center: ", userCenter);

  // get a user
  const getUser = async () => {
    try {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `http://localhost:1000/api/v1/users/one/${userId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setUser(result.user);
          setUserCenter(result.user[0].fitness_center);
          console.log(result.user);
        })
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  // load
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Your Center</h1>
      <br />
      <div className="w-fit">
        <div className="p-5 bg-[#08a88a] text-white rounded shadow-2xl md:flex-row flex  flex-col-reverse gap-5 w-fit">
          {userCenter ? (
            <div className="w-full">
              <h2 className="text-xl font-bold">
                {userCenter ? userCenter[0]?.name : null}
              </h2>
              <div className="text-white mt-2">
                {/* <Message/> */}
                {userCenter ? userCenter[0]?.desc : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <EmailOutlined />
                {userCenter ? userCenter[0]?.email : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <LocationOnOutlined />
                {userCenter ? userCenter[0]?.location : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <Phone />
                {userCenter ? userCenter[0]?.phone : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                Rating: {userCenter ? userCenter[0]?.rating : null}
              </div>
            </div>
          ) : (
            "No Fitness Center"
          )}
        </div>
      </div>
      {/* <Tag */}
    </div>
  );
};

export default Center;
