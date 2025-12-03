import React from "react";
import Lottie from "lottie-react";
import memoryFlowAnimation from "../../assets/memoryFlow.json";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-[#E5F0FB] py-28 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-20">
        {/* Left Content */}
        <div className="max-w-xl space-y-6 z-20 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Empowering{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#3EA8FF] to-[#0E72C2]">
              Citizens, Workers
            </span>{" "}
            & Governments
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            A unified platform where users report issues, gig workers resolve them,
            and governments manage and reward efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              className="bg-linear-to-r from-[#3EA8FF] to-[#0E72C2] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Start Reporting
            </button>
            <button
              type="button"
              className="border border-[#3EA8FF] text-[#3EA8FF] px-6 py-3 rounded-xl font-semibold hover:bg-[#D6E8FB] transition transform hover:scale-105"
            >
              Get Registered
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-full max-w-lg md:max-w-xl">
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
            {/* Animated Lottie */}
            <Lottie 
              animationData={memoryFlowAnimation} 
              loop={true}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice',
                progressiveLoad: true,
                hideOnTransparent: true
              }}
            />
          </div>
        </div>
      </div>

      {/* Background Floating Nodes */}
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-4 h-4 bg-[#3EA8FF]/20 rounded-full animate-float-slower"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </section>
  );
};

export default Hero;
