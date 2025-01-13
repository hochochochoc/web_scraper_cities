import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  X,
  ArrowUpDown,
  Search,
  AlertCircle,
  Minimize,
  Maximize,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CountryMap from "./Maps";

const EditableValue = ({
  value,
  onSave,
  type = "text",
  prefix = "",
  suffix = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(editValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(editValue);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="rounded border px-2 py-0.5 text-sm text-gray-800 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        autoFocus
        step={type === "number" ? "0.000001" : undefined}
      />
    );
  }

  const displayValue =
    type === "number" && value
      ? type === "number" && prefix === "Population: "
        ? parseInt(value).toLocaleString()
        : value
      : value || "N/A";

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer rounded px-1 text-sm hover:bg-gray-700"
    >
      <span className="font-semibold">{prefix}</span>
      {displayValue}
      {suffix}
    </span>
  );
};

const DatabaseCitiesList = ({
  refreshTrigger,
  searchCountry: externalSearchCountry,
}) => {
  const [cities, setCities] = useState([]);
  const [localSearchCountry, setLocalSearchCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [hasSearched, setHasSearched] = useState(false);
  const [proximityClusters, setProximityClusters] = useState({});
  const [expandedCity, setExpandedCity] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const cardRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpandedCity(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearbyCities = (citiesData) => {
    const clusters = {};

    citiesData.forEach((city1, i) => {
      citiesData.forEach((city2, j) => {
        if (i !== j) {
          const isDuplicate =
            city1.name.toLowerCase() === city2.name.toLowerCase();
          const distance = calculateDistance(
            city1.latitude,
            city1.longitude,
            city2.latitude,
            city2.longitude,
          );

          if (distance <= 20 || isDuplicate) {
            if (!clusters[city1.id]) {
              clusters[city1.id] = {
                cities: [],
                isDuplicate: isDuplicate,
              };
            }
            clusters[city1.id].cities.push({
              name: city2.name,
              distance: Math.round(distance),
            });
            if (isDuplicate) {
              clusters[city1.id].isDuplicate = true;
            }
          }
        }
      });
    });

    return clusters;
  };

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

  useEffect(() => {
    const clusters = findNearbyCities(cities);
    setProximityClusters(clusters);
  }, [cities]);

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
      setCities(cities.filter((city) => city.id !== cityId));
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  const handleValueUpdate = (field) => async (value) => {
    if (!editedData) return;

    const newData = {
      ...editedData,
      [field]: field === "population" ? parseInt(value) || 0 : value,
    };
    setEditedData(newData);

    try {
      const cityRef = doc(db, "cities", editedData.id);
      await updateDoc(cityRef, {
        [field === "country" ? "countryName" : field]:
          field === "population" ? parseInt(value) || 0 : value,
      });

      // Update the cities state
      setCities(
        cities.map((city) =>
          city.id === editedData.id
            ? {
                ...city,
                [field === "country" ? "countryName" : field]:
                  field === "population" ? parseInt(value) || 0 : value,
              }
            : city,
        ),
      );
    } catch (error) {
      console.error("Error updating city:", error);
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
        {/* <div className="mt-2">
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
        </div> */}
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
            <div key={city.id} className="relative py-0.5">
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div
                      id={city.id}
                      className={`flex items-center justify-between rounded-md border p-2 ${
                        proximityClusters[city.id]
                          ? proximityClusters[city.id].isDuplicate
                            ? "border-red-500 bg-red-300/50"
                            : "border-red-200 bg-red-50/30"
                          : "border-emerald-100 bg-emerald-50/30"
                      }`}
                      onClick={() => {
                        setExpandedCity(
                          expandedCity === city.id ? null : city.id,
                        );
                        setEditedData(city);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {city.name}
                        </span>
                        {proximityClusters[city.id] && (
                          <AlertCircle size={16} className="text-red-500" />
                        )}
                      </div>
                      <X
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(city.id);
                        }}
                        className="cursor-pointer text-gray-400 hover:text-gray-600"
                      />
                    </div>
                  </TooltipTrigger>
                  {proximityClusters[city.id] &&
                    !proximityClusters[city.id].isDuplicate &&
                    expandedCity !== city.id && (
                      <TooltipContent>
                        <div className="space-y-1 p-1">
                          <p className="text-sm font-medium">
                            Cities within 20km:
                          </p>
                          {proximityClusters[city.id].cities.map(
                            (nearbyCity, index) => (
                              <p key={index} className="text-sm">
                                {nearbyCity.name} ({nearbyCity.distance}km)
                              </p>
                            ),
                          )}
                        </div>
                      </TooltipContent>
                    )}
                </Tooltip>
              </TooltipProvider>

              {expandedCity === city.id && (
                <div
                  ref={cardRef}
                  className="fixed z-50 w-60 rounded-lg border border-gray-600 bg-blue-200/90 p-3 shadow-lg"
                  style={{
                    left: `${
                      document.getElementById(city.id)?.getBoundingClientRect()
                        .right - 1280
                    }px`,
                    top: `${
                      document.getElementById(city.id)?.getBoundingClientRect()
                        .top - 140
                    }px`,
                  }}
                >
                  <div className="flex flex-col gap-1 text-gray-800">
                    <EditableValue
                      value={editedData.name}
                      onSave={handleValueUpdate("name")}
                      prefix="Name: "
                    />
                    <EditableValue
                      value={editedData.countryName}
                      onSave={handleValueUpdate("country")}
                      prefix="Country: "
                    />
                    <EditableValue
                      value={editedData.region}
                      onSave={handleValueUpdate("region")}
                      prefix="Region: "
                    />
                    <EditableValue
                      value={editedData.population}
                      onSave={handleValueUpdate("population")}
                      type="number"
                      prefix="Population: "
                    />
                    <EditableValue
                      value={editedData.latitude}
                      onSave={handleValueUpdate("latitude")}
                      type="number"
                      prefix="Lat: "
                      suffix="°"
                    />
                    <EditableValue
                      value={editedData.longitude}
                      onSave={handleValueUpdate("longitude")}
                      type="number"
                      prefix="Long: "
                      suffix="°"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {cities.length > 0 && (
        <div className={`${showMap ? "relative" : "flex justify-end p-4"}`}>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex h-auto items-center justify-center gap-2 rounded border border-gray-200 bg-white px-2 py-2 text-gray-400 transition-colors hover:bg-blue-50 ${
              showMap ? "absolute bottom-4 right-4 z-10" : ""
            }`}
          >
            {showMap ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          {showMap && (
            <div className="mx-2 mb-3 h-[400px]">
              <CountryMap countryName={localSearchCountry} cities={cities} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseCitiesList;
