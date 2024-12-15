import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

const CountryMap = ({ cities }) => {
  const [hoveredCity, setHoveredCity] = useState(null);

  if (!cities || cities.length === 0) return null;

  const selectedCountry = cities[0]?.countryName;

  const lats = cities.map((city) => parseFloat(city.latitude));
  const longs = cities.map((city) => parseFloat(city.longitude));

  // Calculate center and spreads
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLong = Math.min(...longs);
  const maxLong = Math.max(...longs);

  // Calculate center and apply 15% westward shift
  const longSpan = maxLong - minLong;
  const center = [
    (minLong + maxLong) / 2 - longSpan * -0.2,
    (minLat + maxLat) / 2,
  ];

  const latSpread = maxLat - minLat;
  const longSpread = maxLong - minLong;

  const zoom = Math.max(1, 150 / Math.max(latSpread + 2, longSpread + 2));

  const getCircleRadius = (zoomLevel) => {
    return Math.max(0.3, 2 / zoomLevel);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
      <ComposableMap
        projection="geoMercator"
        style={{
          background: "#f9fafb",
        }}
        className="h-[400px]"
      >
        <ZoomableGroup center={center} zoom={zoom} minZoom={1} maxZoom={20}>
          <Geographies geography="/world-map.json">
            {({ geographies }) =>
              geographies.map(
                (geo) =>
                  geo.properties.name === selectedCountry && (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#cfe8fc"
                      stroke="#4a90e2"
                      strokeWidth={0.2}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          outline: "none",
                          fill: "#cfe8fc",
                        },
                        pressed: {
                          outline: "none",
                        },
                        focus: {
                          outline: "none",
                        },
                      }}
                    />
                  ),
              )
            }
          </Geographies>

          {/* First pass: Render all circles */}
          {cities.map((city) => (
            <Marker
              key={`circle-${city.id}`}
              coordinates={[
                parseFloat(city.longitude),
                parseFloat(city.latitude),
              ]}
            >
              <circle
                r={getCircleRadius(zoom)}
                fill="#1d4ed8"
                stroke="#e5e7eb"
                strokeWidth={0.05}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              />
            </Marker>
          ))}

          {/* Second pass: Render all text */}
          {cities.map((city) => (
            <Marker
              key={`text-${city.id}`}
              coordinates={[
                parseFloat(city.longitude),
                parseFloat(city.latitude),
              ]}
            >
              {hoveredCity?.id === city.id && (
                <text
                  textAnchor="middle"
                  y={-getCircleRadius(zoom) - 1}
                  style={{
                    fontSize: `${24 / zoom}px`,
                    fill: "#1d4ed8",
                    fontWeight: 700,
                    stroke: "#FFFFFF",
                    strokeWidth: 4 / zoom,
                    paintOrder: "stroke",
                  }}
                >
                  {city.name}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default CountryMap;
