import React, { useState } from "react";

const ScraperDisplayCountries = ({ onCountrySearch, onCitySelect }) => {
  const [countryName, setCountryName] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCities([]);
    onCountrySearch(countryName);

    try {
      const response = await fetch(
        `http://localhost:3001/api/country-cities?country=${encodeURIComponent(
          countryName,
        )}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();
      setCities(data);
    } catch (err) {
      setError("Failed to fetch cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-25.8rem)] min-h-0 flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="border-b border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Cities of Country</h2>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
            {cities.length} results
          </span>
        </div>
        <div className="mt-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Enter country name..."
              className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </form>
        </div>
      </div>

      <div className="scrollbar-custom min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {loading ? (
          <div className="p-2 text-gray-500">Loading cities...</div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
            {error}
          </div>
        ) : cities.length === 0 ? (
          <div className="p-2 text-gray-500">
            Enter a country name to search for cities
          </div>
        ) : (
          <div className="space-y-1">
            {cities.map((city, index) => (
              <div
                key={index}
                className="flex cursor-pointer items-center justify-between rounded-md border border-emerald-100 bg-emerald-50/30 p-2 transition-colors hover:bg-blue-50/50"
                onClick={() => onCitySelect(city.name)}
              >
                <span className="font-medium text-gray-700">{city.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScraperDisplayCountries;
