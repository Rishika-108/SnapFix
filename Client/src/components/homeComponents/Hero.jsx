import React from "react";
import Lottie from "lottie-react";
import memoryFlowAnimation from "../../assets/memoryFlow.json";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../context/AuthContext";

const Hero = ({ isDark }) => {
  const { t } = useTranslation();
  const { openLoginModal } = useAuth();

  return (
    <section className={`relative overflow-hidden py-28 px-6 transition-all duration-500 ${
      isDark ? "bg-transparent text-white" : "bg-linear-to-b from-white to-[#E5F0FB] text-gray-900"
    }`}>
      <div className={`container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-20 ${
        isDark ? "bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl" : ""
      }`}>
        
        {/* Left Content */}
        <div className="max-w-xl space-y-5 z-20 relative">
          
          {/* Emotional Hook */}
          <p className="text-sm md:text-base uppercase tracking-widest text-[#3EA8FF] font-semibold">
            {t('heroHook')}
          </p>

          {/* Main Headline */}
          <h1 className={`text-4xl md:text-6xl font-extrabold leading-tight tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {t('heroTitle')}
          </h1>

          {/* Subtext */}
          <p className={`text-lg md:text-xl ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {t('heroSub')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => openLoginModal("citizen")}
              className="bg-linear-to-r from-[#3EA8FF] to-[#0E72C2] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              {t('reportHeroBtn')}
            </button>

            <button
              type="button" 
              onClick={() => openLoginModal("gigworker")}
              className="border border-[#3EA8FF] text-[#3EA8FF] px-6 py-3 rounded-xl font-semibold hover:bg-[#D6E8FB] transition transform hover:scale-105"
            >
              {t('joinWorkerBtn')}
            </button>
          </div>

        </div>

        {/* Right Illustration */}
        <div className="relative w-full max-w-lg md:max-w-xl">
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
            <Lottie
              animationData={memoryFlowAnimation}
              loop={true}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
                progressiveLoad: true,
                hideOnTransparent: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Background Floating Nodes */}
      {Array.from({ length: 6 }).map((_, idx) => (
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
