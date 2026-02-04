import React from "react";

const About = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-14 px-4 bg-[#E5F0FB]">
       <p className="text-xl md:text-2xl uppercase tracking-widest text-[#3EA8FF] font-semibold mb-4">
          Turning civic concerns into coordinated action
        </p>
      <p className="text-lg text-gray-700 max-w-3xl">
        This platform is built to ensure civic problems are no longer ignored.
  It brings together citizens, gig workers, and government authorities
  to act on issues quickly and transparently. Citizens raise concerns,
  workers resolve them on the ground, and authorities manage oversight,
  funding, and accountability — creating cities that respond faster
  and work better for everyone.
      </p>
       {/* Emotional CTA */}
      <p className="text-base md:text-lg font-medium text-[#0E2439]">
        Be part of the change your community needs.
      </p>
    </section>
  );
};

export default About;

