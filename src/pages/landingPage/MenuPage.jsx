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

  return (
    <div className="flex h-screen w-auto flex-col bg-gradient-to-br from-slate-50 to-gray-100 px-10">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <ScraperDisplayCountries
            onCitySelect={handleCitySelect}
            onCountrySearch={handleCountrySearch}
          />
          <ScraperDisplay ref={scraperRef} onApproveCity={handleApproveCity} />
        </div>

        <PendingApproval
          approvedCities={approvedCities}
          onCitiesChange={setApprovedCities}
          onCitySaved={handleCitySaved}
        />

        <DatabaseCitiesList
          searchCountry={searchCountry}
          refreshTrigger={databaseRefreshTrigger}
        />
      </div>
    </div>
  );
}
