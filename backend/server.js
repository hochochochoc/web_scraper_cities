const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

async function scrapeCityData(cityName) {
  try {
    const formattedCityName = cityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("_");

    const response = await axios.get(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(formattedCityName)}`,
    );
    const $ = cheerio.load(response.data);

    let country = null;
    let population = null;
    let region = null;

    // Find country and region in infobox
    $(".infobox")
      .find("tr")
      .each((i, row) => {
        const label = $(row).find("th").text().toLowerCase().trim();
        const value = $(row).find("td").text().trim();

        if (label.includes("sovereign state")) {
          country = value.split("[")[0].trim();
        } else if (label.includes("country") && !country) {
          country = value.split("[")[0].trim();
        }

        // Look for region information
        if (
          !region &&
          (label.includes("province") ||
            label.includes("region") ||
            label.includes("state") ||
            label.includes("prefecture") ||
            label.includes("territory") ||
            label.includes("administrative division") ||
            label.includes("district") ||
            label.includes("county"))
        ) {
          const possibleRegion = value.split("[")[0].trim();
          // Avoid getting coordinates or other non-region information
          if (
            possibleRegion &&
            !possibleRegion.includes("°") &&
            !possibleRegion.includes("km") &&
            !possibleRegion.includes("mi") &&
            possibleRegion.length < 100
          ) {
            region = possibleRegion;
          }
        }
      });

    // If no region found, use city name as region
    region = region || cityName;

    // Rest of the population searching logic...

    $(".infobox")
      .find("tr")
      .each((i, row) => {
        const label = $(row).find("th").text().toLowerCase().trim();
        const value = $(row).find("td").text().trim();

        if (
          label.includes("population") ||
          label.includes("total") ||
          label.includes("urban") ||
          label.includes("metro")
        ) {
          console.log("Found population section:", label);

          const isArea =
            value.includes("km²") ||
            value.includes("km2") ||
            value.includes("sq mi");
          if (isArea) {
            return; // Skip rows that are clearly related to area
          }

          const numbers = value.match(/\d[\d,\s]*/g); // Extract numbers
          if (numbers) {
            for (const num of numbers) {
              const cleanNum = parseInt(num.replace(/[\s,]/g, ""));
              if (cleanNum > 1000 && cleanNum < 100000000) {
                population = cleanNum;
                return false; // Exfit loop once population is found
              }
            }
          }
        } else if (label === "• total" || label.includes("total")) {
          // Fallback to handle sub-label
          const numbers = value.match(/\d[\d,\s]*/g);
          if (numbers) {
            for (const num of numbers) {
              const cleanNum = parseInt(num.replace(/[\s,]/g, ""));
              if (cleanNum > 1000 && cleanNum < 100000000) {
                population = cleanNum;
                return false; // Exit loop
              }
            }
          }
        }
      });

    // Metro population fallback logic...
    if (!population) {
      $(".infobox")
        .find("tr")
        .each((i, row) => {
          const label = $(row).find("th").text().toLowerCase().trim();
          const value = $(row).find("td").text().trim().toLowerCase();
          const hasNumbers = value.match(/[\d,]+/);

          if (
            label.includes("metro") &&
            !label.includes("gdp") &&
            !label.includes("economy")
          ) {
            const isArea =
              hasNumbers &&
              (value.includes("km²") ||
                value.includes("km2") ||
                value.includes("sq mi"));
            if (isArea) {
              return;
            }

            if (
              !value.includes("€") &&
              !value.includes("$") &&
              !value.includes("billion") &&
              !value.includes("gdp")
            ) {
              const popMatch = value.match(/[\d,]+/);
              if (popMatch) {
                const possiblePop = parseInt(popMatch[0].replace(/[,\s]/g, ""));
                if (possiblePop > 1000 && possiblePop < 100000000) {
                  population = possiblePop;
                }
              }
            }
          }
        });
    }

    // Coordinates logic (unchanged)
    const parseDMS = (dms) => {
      let parts = dms.match(/(-?\d+)°(\d+)′(\d+)″([NSEW])/);

      if (parts) {
        const deg = parseInt(parts[1]);
        const min = parseInt(parts[2]);
        const sec = parseInt(parts[3]);
        const dir = parts[4];

        let dd = deg + min / 60 + sec / 3600;
        if (dir === "S" || dir === "W") dd *= -1;
        return parseFloat(dd.toFixed(6));
      }

      parts = dms.match(/(-?\d+)°(\d+)′([NSEW])/);
      if (parts) {
        const deg = parseInt(parts[1]);
        const min = parseInt(parts[2]);
        const dir = parts[3];

        let dd = deg + min / 60;
        if (dir === "S" || dir === "W") dd *= -1;
        return parseFloat(dd.toFixed(6));
      }

      return null;
    };

    const latText = $(".latitude").first().text().trim();
    const longText = $(".longitude").first().text().trim();
    let latitude = null;
    let longitude = null;

    if (latText && longText) {
      latitude = parseDMS(latText);
      longitude = parseDMS(longText);
    }

    return {
      name: cityName,
      country,
      region,
      population,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Error scraping Wikipedia:", error);
    throw new Error(`Failed to scrape data for ${cityName}`);
  }
}

app.get("/api/city-info", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const data = await scrapeCityData(city);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function scrapeCountryCities(countryName) {
  try {
    const formattedCountryName = countryName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("_");

    // Try different possible Wikipedia page formats
    const possibleUrls = [
      `List_of_cities_in_${formattedCountryName}`,
      `List_of_${formattedCountryName}_cities`,
      `List_of_cities_and_towns_in_${formattedCountryName}`,
    ];

    let html = null;
    let usedUrl = null;

    // Try each URL until we find one that works
    for (const urlSuffix of possibleUrls) {
      try {
        const response = await axios.get(
          `https://en.wikipedia.org/wiki/${encodeURIComponent(urlSuffix)}`,
        );
        html = response.data;
        usedUrl = urlSuffix;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!html) {
      throw new Error("Could not find a valid Wikipedia page for city list");
    }

    const $ = cheerio.load(html);
    const cities = new Set();

    // Look for cities in tables
    $("table.wikitable, table.sortable").each((_, table) => {
      $(table)
        .find("tr")
        .each((i, row) => {
          if (i === 0) return; // Skip header row

          // Try to find city name in the first few columns
          const cols = $(row).find("td");
          for (let i = 0; i < Math.min(3, cols.length); i++) {
            const text = $(cols[i])
              .text()
              .trim()
              .split("[")[0] // Remove references
              .split("(")[0] // Remove parentheticals
              .trim();

            if (text && text.length > 1 && !text.match(/^\d/)) {
              cities.add(text);
              break;
            }
          }
        });
    });

    // If no cities found in tables, try lists
    if (cities.size === 0) {
      $("ul li, ol li").each((_, item) => {
        const text = $(item).text().trim().split("[")[0].split("(")[0].trim();

        if (text && text.length > 1 && !text.match(/^\d/)) {
          cities.add(text);
        }
      });
    }

    return Array.from(cities)
      .slice(0, 30)
      .map((city) => ({
        name: city,
        country: countryName,
      }));
  } catch (error) {
    console.error("Error scraping Wikipedia:", error);
    throw new Error(`Failed to scrape city list for ${countryName}`);
  }
}

app.get("/api/country-cities", async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: "Country parameter is required" });
  }

  try {
    const data = await scrapeCountryCities(country);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
