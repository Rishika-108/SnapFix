import React, { useEffect, useState } from "react";

const IssueLocation = ({ coordinates }) => {
  const [place, setPlace] = useState("Unknown Location");

  useEffect(() => {
    const fetchPlace = async () => {
      if (!coordinates) return;
      const [lng, lat] = coordinates;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setPlace(data.address?.city || data.address?.town || data.address?.village || data.display_name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlace();
  }, [coordinates]);

  return <span>{place}</span>;
};

export default IssueLocation; 