import React from "react";

function WeatherCard({ data }) {
  return (
<div className="mt-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center w-80">
  <h2 className="text-2xl font-semibold text-gray-800">
    {data.city}, {data.country}
  </h2>
  <p className="text-gray-600 text-xs mb-1">Reading: {new Date(data.time).toLocaleString()}</p>
  <p className="text-gray-500 text-xs mb-2">Local: {new Date().toLocaleString()}</p>

  <div className="text-6xl font-bold text-indigo-600 mt-4">
    {data.temperature}°C
  </div>
  <p className="text-gray-700 mt-2">💨 Wind: {data.windspeed} km/h</p>
</div>

  );
}

export default WeatherCard;
