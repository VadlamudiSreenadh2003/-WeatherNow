import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 bg-white rounded-full shadow-lg px-4 py-2 w-full max-w-md"
    >
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-grow outline-none text-gray-700"
      />
      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-full"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
