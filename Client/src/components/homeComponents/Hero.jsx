import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-linear-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        Empowering Citizens, Workers & Governments
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        A unified platform where users report issues, gig workers resolve them,
        and governments manage and reward efficiently.
      </p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
        Get Started
      </button>
    </section>
  );
};

export default Hero;
