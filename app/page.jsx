"use client";
import Navbar from "./components/Navbar";
import Splash from "./components/Splash";
import Footer from "./components/Footer";
import Work from "./components/Modules";
import AboutUs from "./components/About";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#edf1f7] justify-between ">
      <Navbar />
      <Splash /> 
      <Work />
      <AboutUs />
      <Footer />
    </main>
  );
}
