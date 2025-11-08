import React from "react";

const features = [
  {
    id: 1,
    title: "Quick Memory Capture",
    description: "Save your thoughts, pictures, and links instantly.",
    icon: "📝"
  },
  {
    id: 2,
    title: "Analytics Insights",
    description: "Track patterns and trends in your memories over time.",
    icon: "📊"
  },
  {
    id: 3,
    title: "Secure Storage",
    description: "All your memories are stored safely in the cloud.",
    icon: "🔒"
  }];

const Features = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800">
        Platform Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-3 text-blue-600">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
