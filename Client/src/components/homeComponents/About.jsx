import React from "react";

const About = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#E5F0FB]">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#0E2439]">
        About the Platform
      </h2>
      <p className="text-lg text-gray-700 max-w-3xl">
        This project bridges the gap between citizens, gig workers, and government authorities. 
        Users can report issues, gig workers can bid to resolve them, and government officials can track, 
        assign, and reward efficiently — creating a transparent and fast solution ecosystem.
      </p>
    </section>
  );
};

export default About;
