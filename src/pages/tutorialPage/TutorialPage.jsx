import React, { useState } from "react";
import { Search, Plus, Check, Globe, X, ArrowUpDown } from "lucide-react";

export default function TutorialPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="mx-auto flex h-full max-w-[1400px] flex-col">
        {/* Header - fixed height */}
        <div className="mb-4 flex h-12 items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-blue-600" size={24} />
            <h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl font-bold text-transparent">
              City Database Manager
            </h1>
          </div>
          <div className="relative">
            <input
              type="text"
              className="w-64 rounded-lg border border-gray-200 bg-white/50 py-1.5 pl-3 pr-8 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Search countries..."
              defaultValue="Ireland"
            />
            <Search
              className="absolute right-2.5 top-2 text-gray-400"
              size={16}
            />
          </div>
        </div>

        {/* Main Content - fills remaining height */}
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
          {/* Left Column: Available Cities + Details */}
          <div className="flex min-h-0 flex-col gap-4">
            {/* City Details - fixed height based on content */}
            <div className="rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
              <div className="border-b border-gray-100 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">City Details</h2>
                  <div className="relative w-48">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-200 py-1 pl-3 pr-8 text-sm"
                      placeholder="Search cities..."
                    />
                    <Search
                      className="absolute right-2 top-1.5 text-gray-400"
                      size={14}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/30 p-3">
                  <h3 className="mb-2 font-bold text-gray-900">Limerick</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Country: </span>Ireland
                    </div>
                    <div>
                      <span className="font-semibold">Region: </span>Munster
                    </div>
                    <div>
                      <span className="font-semibold">Population: </span>102,287
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold">Coordinates:</div>
                      <div className="pl-2 text-gray-600">
                        <div>Latitude: 52.665278°</div>
                        <div>Longitude: -8.623889°</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Cities - fills remaining height */}
            <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
              <div className="border-b border-gray-100 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    Available Cities
                  </h2>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-sm font-medium text-blue-700">
                    30 cities
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {[
                  "Dublin",
                  "Cork",
                  "Limerick",
                  "Galway",
                  "Waterford",
                  "Drogheda",
                  "Dundalk",
                  "Swords",
                ].map((city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between rounded-md border border-transparent p-2 transition-colors hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <span className="font-medium text-gray-700">{city}</span>
                    <Plus
                      size={16}
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Approval - scrollable list */}
          <div className="flex min-h-0 flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
            <div className="border-b border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Pending Approval
                </h2>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-700">
                  3 cities
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {["Kilkenny", "Sligo", "Tralee"].map((city) => (
                <div
                  key={city}
                  className="flex items-center justify-between rounded-md border border-amber-100 bg-amber-50/30 p-2"
                >
                  <span className="font-medium text-gray-700">{city}</span>
                  <div className="flex gap-1">
                    <Check
                      size={16}
                      className="cursor-pointer text-emerald-600 hover:text-emerald-700"
                    />
                    <X
                      size={16}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database - scrollable list */}
          <div className="flex min-h-0 flex-col rounded-lg border border-gray-200/50 bg-white/70 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
            <div className="border-b border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Database</h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
                    5/30
                  </span>
                  <ArrowUpDown
                    size={14}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {["Belfast", "Derry", "Lisburn", "Bangor", "Newtownards"].map(
                (city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50/30 p-2"
                  >
                    <span className="font-medium text-gray-700">{city}</span>
                    <X
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
