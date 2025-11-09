import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AreaPerformanceMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getAreaPerformance().then(setData);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        {/* Area Performance Overview */}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" />
          <YAxis dataKey="area" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="issues" fill="#2563eb" name="Issues Reported" />
          <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaPerformanceMap;
