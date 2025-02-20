"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] text-white">
      {/* Left Side: Hero Text */}
      <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-8 md:px-12 lg:px-24 xl:px-32">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight drop-shadow-lg"
        >
          Welcome to <span className="text-yellow-300">CiCo App</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-gray-200 mt-4"
        >
          The ultimate solution for seamless clock-in and clock-out management.
        </motion.p>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex mt-6 space-x-4"
        >
          <button
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-500 hover:to-blue-500 transform hover:scale-105 transition-all"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
          <button
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-orange-500 hover:to-yellow-400 transform hover:scale-105 transition-all"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </motion.div>
      </div>

      {/* Right Side: Hero Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0"
      >
        <div className="relative w-[80%] h-[60%] max-w-lg bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
          <img
            src="/cico-hero.webp"
            alt="WFH Attendance Illustration"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </motion.div>

      {/* Floating Decoration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-10 left-10 text-gray-200 text-xs md:text-sm"
      >
        <p>🚀 Streamline your team’s productivity today!</p>
      </motion.div>
    </div>
  );
}
