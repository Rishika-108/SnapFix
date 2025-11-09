import React from "react";

const FeatureHighlights = () => {
  const features = [
    {
      id: 1,
      title: "Report & Track Issues",
      description: "Users can easily report civic issues and monitor their progress in real-time.",
      icon: "📝"
    },
    {
      id: 2,
      title: "Bid & Earn",
      description: "Gig workers can find nearby issues, bid for tasks, and get rewarded upon completion.",
      icon: "📊"
    },
    {
      id: 3,
      title: "Smart Dashboard",
      description: "Governments get an AI-driven dashboard for assigning, tracking, and funding efficiently.",
      icon: "🔒"
    }
  ];

  return (
    <section className="relative py-20 bg-linear-to-b from-white to-[#E5F0FB] overflow-hidden">
      {/* Floating Accent Circles */}
      <div className="absolute top-10 left-0 w-32 h-32 bg-[#3EA8FF]/20 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-16 right-0 w-24 h-24 bg-[#0E72C2]/20 rounded-full filter blur-2xl animate-float-slower"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-[#0E2439]">
          Why <span className="text-[#3EA8FF]">SnapFix?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map(({ id, title, description, icon }) => (
            <div
              key={id}
              className="group bg-white rounded-3xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex flex-col items-center text-center p-8 border border-[#3EA8FF]/10"
            >
              <div className="text-6xl mb-6 text-[#3EA8FF] transform transition-transform group-hover:rotate-12">
                {icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-[#0E2439] group-hover:text-[#0E72C2] transition-colors">
                {title}
              </h3>
              <p className="text-gray-700 text-md">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Floating Tech Nodes */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 bg-[#3EA8FF]/20 rounded-full animate-float-slow"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </section>
  );
};

export default FeatureHighlights;
