import React, { useState } from "react";
import Header from "./components/header/Header";
import ScraperDisplay from "./components/scaper/Scraper";
import ScraperDisplayCountries from "./components/scaper/ScraperCountries";

export default function MenuPage() {
  const [mapState, setMapState] = useState("countries");
  return (
    <div className="flex h-screen w-auto flex-col bg-gradient-to-b from-egg to-gray-800">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
      </div>
      <div className="mt-20 flex flex-col space-y-3 text-center">
        <ScraperDisplay />
        <ScraperDisplayCountries />
      </div>
    </div>
  );
}
