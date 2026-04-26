import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

const About = ({ isDark }) => {
  const { t } = useTranslation();

  return (
    <section className={`flex flex-col items-center justify-center text-center py-14 px-4 transition-all duration-500 ${
      isDark ? "bg-transparent" : "bg-[#E5F0FB]"
    }`}>
       <p className="text-xl md:text-2xl uppercase tracking-widest text-[#3EA8FF] font-semibold mb-4">
          {t('aboutTitle')}
        </p>
      <p className={`text-lg max-w-3xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {t('aboutSub')}
      </p>
    </section>
  );
};

export default About;

