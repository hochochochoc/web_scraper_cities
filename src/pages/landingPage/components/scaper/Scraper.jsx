import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Search } from "lucide-react";

const EditableValue = ({
  value,
  onSave,
  type = "text",
  prefix = "",
  suffix = "",
  isName = false,
  formatter = null,
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
        className="rounded border px-2 py-1 text-gray-800"
        autoFocus
        step={type === "number" ? "0.000001" : undefined}
      />
    );
  }

  const displayValue =
    type === "number" && formatter
      ? formatter(value)
      : value || (isName ? "City Name" : "-");

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer rounded px-1 hover:bg-gray-100/50"
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

const ScraperDisplay = forwardRef(({ onApproveCity }, ref) => {
  const [cityName, setCityName] = useState("");
  const [cityData, setCityData] = useState({
    name: "",
    country: "",
    region: "",
    population: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    searchCity: async (name) => {
      setCityName(name);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/city-info?city=${encodeURIComponent(name)}`,
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
    },
  }));

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!cityName.trim()) return;

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

  const handleValueUpdate = (field) => (value) => {
    setCityData((prev) => ({
      ...prev,
      [field]: field === "population" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="rounded-lg border border-gray-200/50 bg-white shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="border-b border-gray-100 p-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-between"
        >
          <h2 className="font-semibold text-gray-900">City Details</h2>
          <div className="relative flex w-48">
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-1 pl-3 pr-8 text-sm"
              placeholder="Enter city name"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
            >
              <Search size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* {loading && (
        <div className="p-3 text-center text-gray-600">Loading...</div>
      )} */}

      {error && (
        <div className="mx-3 rounded-md bg-red-50 px-3 py-1 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="p-3">
        <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/30 p-3">
          <h3 className="mb-2 font-bold text-gray-900">
            <EditableValue
              value={cityData.name}
              onSave={handleValueUpdate("name")}
              isName={true}
            />
          </h3>
          <div className="space-y-1 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Country: </span>
              <EditableValue
                value={cityData.country}
                onSave={handleValueUpdate("country")}
              />
            </div>
            <div>
              <span className="font-semibold">Region: </span>
              <EditableValue
                value={cityData.region}
                onSave={handleValueUpdate("region")}
              />
            </div>
            <div>
              <span className="font-semibold">Population: </span>
              <EditableValue
                value={cityData.population}
                onSave={handleValueUpdate("population")}
                type="number"
                prefix=""
                formatter={(value) =>
                  value ? parseInt(value).toLocaleString() : "-"
                }
              />
            </div>
            <div className="mt-2">
              <span className="font-semibold">Coordinates:</span>
              <div className="pl-2 text-gray-600">
                <div>
                  <EditableValue
                    value={cityData.latitude}
                    onSave={handleValueUpdate("latitude")}
                    type="number"
                    prefix="Latitude: "
                    suffix="°"
                  />
                </div>
                <div>
                  <EditableValue
                    value={cityData.longitude}
                    onSave={handleValueUpdate("longitude")}
                    type="number"
                    prefix="Longitude: "
                    suffix="°"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={() => onApproveCity(cityData)}
          className="w-full rounded bg-[#303030] px-3 py-1.5 text-white transition-colors hover:bg-gray-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
});

ScraperDisplay.displayName = "ScraperDisplay";

export default ScraperDisplay;
