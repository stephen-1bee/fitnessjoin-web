import React from "react";
import Image from "next/image";

const Work = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white py-9"
      id="Modules"
    >
      {/* Container for all divs */}
      <div className="flex flex-col md:flex-col mx-4 gap-6 items-center justify-center">
        <h1 className="font-bold text-4xl mb-5">Core Modules</h1>
        <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex flex-col items-center bg-white rounded-lg h-[40vh] w-[40vh]">
                <Image width={300} height={300} alt=".." src="/lady.jpg" className="rounded-lg h-[100%] w-[100%]"/>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mt-2">Fitness Centers</h3>
                  <p className="text-gray-800 text-sm text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
                    urna eu ex feugiat condimentum.
                  </p>
                </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-lg h-[40vh] w-[40vh]">
                <Image width={300} height={300} alt=".." src="/pretty.jpg" className="rounded-lg h-[100%] w-[100%]"/>
                <div className="p-6 text-center bg-white">
                  <h3 className="text-xl font-bold mt-2">Fitness Centers</h3>
                  <p className="text-gray-800 text-sm text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
                    urna eu ex feugiat condimentum.
                  </p>
                </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-lg h-[40vh] w-[40vh]">
                <Image width={300} height={300} alt=".." src="/beauty.jpg" className="rounded-lg h-[100%] w-[100%]"/>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mt-2">Fitness Centers</h3>
                  <p className="text-gray-800 text-sm text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
                    urna eu ex feugiat condimentum.
                  </p>
                </div>
            </div>
        </div>
        {/* <div className="shadow flex flex-col items-center">
            <Image width={400} height={400} alt=".." src="/gym.jpg" className="rounded-lg"/>
            <div className="p-6">
              <h3 className="text-xl font-bold mt-2">Fitness Centers</h3>
              <p className="text-gray-800 text-sm text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
                urna eu ex feugiat condimentum.
              </p>
            </div>
        </div>
        <div className="flex flex-col gap-2 items-center bg-navbar  p-8 rounded-lg w-80">
          <div className="w-24 h-18 rounded-full flex items-center justify-center">
            <Image width={400} height={400} alt=".." src="/gym.jpg" className="w-[100%]"/>
          </div>
          <h3 className="text-xl font-bold  mt-2">Fitness Centers</h3>
          <p className="text-gray-800 text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
            urna eu ex feugiat condimentum.
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center p-8 shadow-xl rounded-lg w-80 bg-navbar ">
          <div className="w-24 h-18 rounded-full flex items-center justify-center">
            <Image width={400} height={400} alt=".." src="/trainer.png" />
          </div>
          <h3 className="text-xl font-bold mt-2">Trainers</h3>
          <p className="text-gray-800 text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
            urna eu ex feugiat condimentum.
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center p-8 shadow-xl bg-navbar rounded-lg w-80">
          <div className="w-24 h-18 rounded-full flex items-center justify-center">
            <Image width={400} height={400} alt=".." src="/client.png" />
          </div>
          <h3 className="text-xl font-bold mt-2">Clients</h3>
          <p className="text-gray-800 text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
            urna eu ex feugiat condimentum.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Work;
