import React, { useState } from "react";

const ScraperDisplayCountries = () => {
  const [cityName, setCityName] = useState("");
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/city-info?city=${encodeURIComponent(cityName)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city data");
      }

      const data = await response.json();
      setCityData(data);
    } catch (err) {
      setError("Failed to fetch city information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter country name"
          className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !cityName.trim()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Search
        </button>
      </form>

      {loading && <div className="py-8 text-center text-white">Loading...</div>}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      {cityData && (
        <div className="rounded-lg border border-gray-200 p-4 text-white">
          <h2 className="mb-4 mt-0 text-xl font-bold">{cityData.name}</h2>
          <div className="flex flex-col gap-2">
            <p>
              <strong>Country:</strong> {cityData.country}
            </p>
            <p>
              <strong>Population:</strong>{" "}
              {cityData.population?.toLocaleString()}
            </p>
            <p>
              <strong>Coordinates:</strong>
            </p>
            <div className="ml-6 list-disc">
              <p>Latitude: {cityData.latitude}°</p>
              <p>Longitude: {cityData.longitude}°</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScraperDisplayCountries;
