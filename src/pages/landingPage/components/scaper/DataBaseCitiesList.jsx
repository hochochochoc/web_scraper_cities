import React, { useState, useEffect } from "react";
import { db } from "../../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { X, ArrowUpDown, Search } from "lucide-react";

const DatabaseCitiesList = ({
  refreshTrigger,
  searchCountry: externalSearchCountry,
}) => {
  const [cities, setCities] = useState([]);
  const [localSearchCountry, setLocalSearchCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchCities = async (searchTerm) => {
    if (!searchTerm?.trim()) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    try {
      const citiesRef = collection(db, "cities");
      const q = query(citiesRef, where("countryName", "==", searchTerm.trim()));

      const querySnapshot = await getDocs(q);
      const citiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedCities = citiesData.sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });

      setCities(sortedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLocalSearchCountry(e.target.value);
  };

  useEffect(() => {
    if (externalSearchCountry) {
      setHasSearched(true);
      setLocalSearchCountry(externalSearchCountry);
      fetchCities(externalSearchCountry);
    }
  }, [externalSearchCountry, sortOrder]);

  useEffect(() => {
    if (hasSearched && (localSearchCountry || externalSearchCountry)) {
      fetchCities(localSearchCountry || externalSearchCountry);
    }
  }, [refreshTrigger]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setHasSearched(true);
      fetchCities(localSearchCountry);
    }
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    if (hasSearched) {
      fetchCities(localSearchCountry || externalSearchCountry);
    }
  };

  const handleDelete = async (cityId) => {
    try {
      await deleteDoc(doc(db, "cities", cityId));
      // Remove the city from local state
      setCities(cities.filter((city) => city.id !== cityId));
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-5rem)] flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="border-b border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Database</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
              {cities.length}/30
            </span>
            <ArrowUpDown
              size={14}
              onClick={toggleSort}
              className="cursor-pointer text-gray-400 hover:text-gray-600"
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by country..."
              value={localSearchCountry}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-gray-200 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="scrollbar-custom min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="p-2 text-gray-500">Loading cities...</div>
        ) : !hasSearched ? (
          <div className="p-2 text-gray-500">
            Enter a country name and press Enter to search
          </div>
        ) : cities.length === 0 ? (
          <div className="p-2 text-gray-500">
            No cities found for this country
          </div>
        ) : (
          cities.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50/30 p-2"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">{city.name}</span>
              </div>
              <X
                size={16}
                onClick={() => handleDelete(city.id)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DatabaseCitiesList;
