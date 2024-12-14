import React, { useState, useRef, useEffect } from "react";
import { db } from "../../../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { X, Check } from "lucide-react";

const EditableValue = ({
  value,
  onSave,
  type = "text",
  prefix = "",
  suffix = "",
}) => {
  // EditableValue component remains unchanged
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
      className="cursor-pointer rounded px-1 pr-20 text-sm hover:bg-gray-700"
    >
      <span className="font-semibold">{prefix}</span>
      {displayValue}
      {suffix}
    </span>
  );
};

const ApprovedCityCard = ({ cityData, onDelete, onUpdate, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedData, setEditedData] = useState(cityData);
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleValueUpdate = (field) => (value) => {
    const newData = {
      ...editedData,
      [field]: field === "population" ? parseInt(value) || 0 : value,
    };
    setEditedData(newData);
    onUpdate(cityData.name, newData);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(cityData);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      await onSave(editedData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative py-0.5">
      <div className="flex items-center justify-between rounded-md border border-amber-100 bg-amber-50/30 p-2">
        <span
          id={cityData.name}
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer font-medium text-gray-700 hover:text-blue-300"
        >
          {editedData.name}
        </span>
        <div className="flex gap-1">
          <Check
            size={16}
            onClick={handleSaveClick}
            className={`cursor-pointer ${
              isSaving
                ? "text-gray-400"
                : "text-emerald-600 hover:text-emerald-700"
            }`}
          />
          <X
            size={16}
            onClick={handleDeleteClick}
            className="cursor-pointer text-red-500 hover:text-red-600"
          />
        </div>
      </div>

      {isExpanded && (
        <div
          ref={cardRef}
          className="fixed z-50 rounded-lg border border-gray-600 bg-blue-200 p-3 shadow-lg"
          style={{
            left: `${document.getElementById(cityData.name)?.getBoundingClientRect().right - 460}px`,
            top: `${document.getElementById(cityData.name)?.getBoundingClientRect().top - 140}px`,
          }}
        >
          <div className="flex flex-col gap-1 text-gray-800">
            <EditableValue
              value={editedData.name}
              onSave={handleValueUpdate("name")}
              prefix="Name: "
            />
            <EditableValue
              value={editedData.country}
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
  );
};

const PendingApproval = ({ approvedCities, onCitiesChange, onCitySaved }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = (cityToDelete) => {
    onCitiesChange((prevCities) =>
      prevCities.filter(
        (city) =>
          city.name !== cityToDelete.name ||
          city.latitude !== cityToDelete.latitude ||
          city.longitude !== cityToDelete.longitude,
      ),
    );
  };

  const handleUpdate = (cityName, newData) => {
    onCitiesChange((prev) =>
      prev.map((city) => (city.name === cityName ? newData : city)),
    );
  };

  const saveCity = async (cityData) => {
    try {
      const citiesRef = collection(db, "cities");
      const cityToSave = {
        name: cityData.name,
        countryName: cityData.country,
        latitude: parseFloat(cityData.latitude),
        longitude: parseFloat(cityData.longitude),
        population: parseInt(cityData.population),
        region: cityData.region,
      };

      await addDoc(citiesRef, cityToSave);
      onCitySaved();
      handleDelete(cityData);
    } catch (error) {
      console.error("Error saving city to database:", error);
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const city of approvedCities) {
        await saveCity(city);
      }
    } catch (error) {
      console.error("Error saving cities to database:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-5rem)] min-h-0 flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
      <div className="border-b border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pending Approval</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
              {approvedCities.length}/30
            </span>
          </div>
        </div>
      </div>
      <div className="scrollbar-custom flex-1 space-y-1 overflow-y-auto p-2">
        <div className="rounded-lg bg-white">
          {approvedCities.length === 0 ? (
            <p className="p-2 text-gray-400">No cities added yet</p>
          ) : (
            <div>
              {approvedCities.map((city) => (
                <ApprovedCityCard
                  key={`${city.name}-${city.latitude}-${city.longitude}`}
                  cityData={city}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onSave={saveCity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {approvedCities.length > 0 && (
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full rounded bg-blue-500 px-3 py-1.5 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-400"
          >
            {isSaving ? "Saving..." : "Save all to Database"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingApproval;
