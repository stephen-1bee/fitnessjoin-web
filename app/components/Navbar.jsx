"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import { Close, LightModeOutlined, Menu } from "@mui/icons-material"

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false)
  const handleMode = () => {
    setDarkMode((prevState) => !prevState)
  }
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }
  const closeMenu = () => {
    setMenuVisible(false)
  }

  return (
    <nav className="flex h-[8vh]  bg-[#fdf9f0] p-5  w-full items-center justify-between lg:p-12 mb-7 gap-2  fixed z-[999]">
      <div>
        <Link href="/" className="flex items-center justify-center gap-1">
          <Image width={50} height={50} alt="logo" src="/logo.png" />
          <p className="text-lg font-black">
            Fitness<span className=" text-[#08A88A]">Join</span>
          </p>
        </Link>
      </div>
      {/* Menu */}
      <div className="lg:flex hidden gap-10">
        <Link href="/" className="hover:text-btn transition-all">
          Home
        </Link>
        <Link href="#Modules" className="hover:text-btn transition-all">
          Modules
        </Link>
        <Link href="#About" className="hover:text-btn transition-all">
          About Us
        </Link>
        <Link href="#Footer" className="hover:text-btn transition-all">
          Contact Us
        </Link>
      </div>

      <div className="flex gap-3 text-sm ">
        {/* Multilingual */}
        <div className="flex gap-5 items-center">
          <div className="flex ">
            <select className="bg-[#f1f1f1] outline-none bg-transparent cursor-pointer">
              <option value="">EN</option>
              <option value="">FR</option>
            </select>
          </div>
          <div onClick={handleMode} className="cursor-pointer">
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlined />}
          </div>
          {/* Hamburger Menu Button */}
          <button onClick={toggleMenu}>
            <Menu className="md:hidden" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuVisible && (
          <div className="fixed inset-0 bg-white h-screen w-screen flex flex-col items-center justify-center mobile-nav">
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4  focus:outline-none"
            >
              <Close className="md:hidden" />
            </button>
            <ul className="text-xl text-center space-y-4 list-none">
              <li>
                <a href="/" onClick={closeMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="#About" onClick={closeMenu}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#Modules" onClick={closeMenu}>
                  Modules
                </a>
              </li>
              <li>
                <a href="#Footer" onClick={closeMenu}>
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        )}
        <Link
          href="/start"
          className="text-white  bg-[#08A88A] px-8 py-3 rounded-full hover:shadow-lg transition duration-150 hidden md:block"
        >
          <h1>Get Started</h1>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
