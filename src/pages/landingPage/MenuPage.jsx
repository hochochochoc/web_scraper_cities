import React, { useState, useRef } from "react";
import Header from "./components/header/Header";
import ScraperDisplay from "./components/scaper/Scraper";
import ScraperDisplayCountries from "./components/scaper/CityScraper";
import PendingApproval from "./components/scaper/PendingApproval";
import DatabaseCitiesList from "./components/scaper/DataBaseCitiesList";

export default function MenuPage() {
  const [approvedCities, setApprovedCities] = useState([]);
  const [databaseRefreshTrigger, setDatabaseRefreshTrigger] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for input value
  const [showMap, setShowMap] = useState(false);
  const scraperRef = useRef();

  const handleCitySelect = (cityName) => {
    if (scraperRef.current) {
      scraperRef.current.searchCity(cityName);
    }
  };

  const handleCitySaved = () => {
    setDatabaseRefreshTrigger((prev) => prev + 1);
  };

  const handleApproveCity = (cityData) => {
    setApprovedCities((prev) => [...prev, cityData]);
  };

  const handleCountrySearch = (country) => {
    setSearchCountry(country);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCountrySearch(searchInput);
    }
  };

  return (
    <div className="flex h-screen w-auto flex-col bg-gradient-to-r from-sky-100 to-amber-100 px-10">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
        <div className="h-14"></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div></div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search country..."
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="absolute left-1/2 top-[3px] z-50 w-full -translate-x-1/2 rounded-xl bg-white/50 px-4 py-2 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div></div>
      </div>

      <div
        className="mb-2 min-h-0 flex-1 rounded-2xl bg-white/50"
        style={{
          clipPath:
            "polygon(0 0, 32.40% 0, 32.50% 0.5px, 32.60% 1px, 32.70% 1.5px, 32.80% 2px, 32.90% 3px, 33.00% 4px, 33.10% 5.5px, 33.20% 7px, 33.33% 10px, 33.33% 40px, 33.40% 42px, 33.48% 43.5px, 33.56% 45px, 33.66% 46px, 33.76% 47px, 33.86% 47.5px, 34.00% 48.5px, 34.20% 49px, 34.66% 50px, 65.33% 50px, 65.80% 49px, 66.00% 48.5px, 66.13% 47.5px, 66.23% 47px, 66.33% 46px, 66.43% 45px, 66.51% 43.5px, 66.59% 42px, 66.66% 40px, 66.66% 10px, 66.80% 7px, 66.90% 5.5px, 67.00% 4px, 67.10% 3px, 67.20% 2px, 67.30% 1.5px, 67.40% 1px, 67.50% 0.5px, 67.60% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="grid h-full min-h-0 grid-cols-3 gap-4 p-2">
          <div className="flex min-h-0 flex-col gap-4">
            <ScraperDisplayCountries
              onCitySelect={handleCitySelect}
              onCountrySearch={handleCountrySearch}
              searchTerm={searchCountry} // Add this prop to filter countries
            />
            <ScraperDisplay
              ref={scraperRef}
              onApproveCity={handleApproveCity}
            />
          </div>

          <div className="relative flex flex-col">
            <div className="mt-[50px]">
              <PendingApproval
                approvedCities={approvedCities}
                onCitiesChange={setApprovedCities}
                onCitySaved={handleCitySaved}
              />
            </div>
          </div>

          <DatabaseCitiesList
            searchCountry={searchCountry}
            refreshTrigger={databaseRefreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
