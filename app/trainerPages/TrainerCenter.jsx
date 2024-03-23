import {
  ArrowRight,
  EmailOutlined,
  LocationOnOutlined,
  Phone,
} from "@mui/icons-material";
import FrownOutlined from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const TrainerCenter = () => {
  const [trainer, setTrainer] = useState(null);
  const [trainerCenter, setTrainerCenter] = useState(null);

  // rating
  const handleRating = (rate) => {
    const stars = [];

    for (let i = 0; i < rate; i++) {
      stars.push("⭐️ ");
    }
  };

  // get trainer id
  let trainer_id;
  if (typeof sessionStorage !== "undefined") {
    trainer_id = sessionStorage.getItem("trainerId");
  }

  const getTrainer = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `http://localhost:1000/api/v1/trainers/one/${trainer_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setTrainer(result.trainer);
          console.log(result.trainer);
          setTrainerCenter(result.trainer[0]?.fitness_center);
          console.log(result.trainer[0]?.fitness_center[0]);
        })
        .catch((error) => console.error(error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTrainer();
  }, []);

  return (
    <div>
      <h1 className="text-3xl">Fitness Center</h1>
      <p className="flex text-[16px] py-4">
        Home{" "}
        <span>
          <ArrowRight />
        </span>{" "}
        Fitness Center
      </p>
      <br />
      <div className="w-fit">
        <div className="p-5 bg-[#08a88a] text-white rounded shadow-2xl md:flex-row flex  flex-col-reverse gap-5 w-fit">
          {trainerCenter ? (
            <div className="w-full">
              <h2 className="text-xl font-bold">
                {trainerCenter ? trainerCenter[0]?.name : null}
              </h2>
              <div className="text-white mt-2">
                {/* <Message/> */}
                {trainerCenter ? trainerCenter[0]?.desc : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <EmailOutlined />
                {trainerCenter ? trainerCenter[0]?.email : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <LocationOnOutlined />
                {trainerCenter ? trainerCenter[0]?.location : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                <Phone />
                {trainerCenter ? trainerCenter[0]?.phone : null}
              </div>
              <div className="text-white mt-2 gap-2 flex">
                Rating:{" "}
                {trainerCenter &&
                  handleRating(trainerCenter[0]?.rating, (star, index) => (
                    <span key={index}>{star}</span>
                  ))}
              </div>
            </div>
          ) : (
            <div>
              <FrownOutlined className="text-black" />
              <p className="text-white">No Fitness Center</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerCenter;
