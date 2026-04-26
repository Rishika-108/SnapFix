import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center text-center py-14 px-4 bg-[#E5F0FB]">
       <p className="text-xl md:text-2xl uppercase tracking-widest text-[#3EA8FF] font-semibold mb-4">
          {t('aboutTitle')}
        </p>
      <p className="text-lg text-gray-700 max-w-3xl">
        {t('aboutSub')}
      </p>
    </section>
  );
};

export default About;

