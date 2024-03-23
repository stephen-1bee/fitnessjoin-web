import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AccessibilityNewOutlined,
  NotificationAddOutlined,
  Verified,
} from "@mui/icons-material"

const Splash = () => {
  return (
    <div className="bg-[#f9fafd] min-h-screen md:min-h-screen flex justify-center  items-center text-center md:p mt-20 home">
      <div className="flex flex-col items-center">
        <h1 h1 className="text-8xl text-white font-black">
          Fitness & Wellness{" "}
          <span className="text-[#08A88A] font-bold">
            <br />
            Re-imagined!
          </span>
        </h1>
        <p className="text-white text-xl mt-5 w-[70%]">
          {" "}
          With FitnessJoin, you are assured of quality fitness services for
          fitness centers and fitness enthusiasts.
        </p>
        <div className="mt-[2rem] flex items-center gap-5">
          <Link
            href="/start"
            className="bg-[#08A88A] text-white py-4 px-6 rounded-full w-[200px] hover:shadow-xl transition-all duration-300 tranform hover:scale-102"
          >
            Get Started
          </Link>
          <Link
            href="/newDecision"
            className="bg-transparent ring-[1px] ring-white text-white py-4 px-6 rounded-full w-[200px] hover:shadow-xl transition-all duration-300 tranform hover:scale-102"
          >
            Login Now
          </Link>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row items-center justify-center mt-24">
        <div className="md:flex flex-col w-[60%] md:w-[100%] items-center md:items-start">
          <h1 className="text-5xl md:text-8xl font-semibold text-center md:text-left mb-3 intro-title text-white w-[60%] text-center">
            Fitness & Wellness <span className="text-[#08A88A] font-bold">Re-imagined!</span>
          </h1>
          <p className="text-white w-[60%] text-center md:text-center text-2xl mt-3 mb-9 flex items-center justify-center"> With FitnessJoin, you are assured of quality fitness services for
            fitness centers and fitness enthusiasts.</p>
          <Link
            href="/start"
            className="bg-[#08A88A] text-white py-4 px-6 rounded-full w-[50%] hover:shadow-xl transition-all duration-300 tranform hover:scale-102 mt-[0.2rem]"
          >
            Get Started 
          </Link>
        </div>
        
      </div> */}
    </div>
  )
}

export default Splash
