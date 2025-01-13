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
                return false; // Exit loop once population is found
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

    // Coordinates logic
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
    // Define terms to exclude
    const excludedTerms = [
      "state's largest city",
      "federal capital",
      "state capital",
      "largest city",
      "administrative center",
      "administrative division",
      "metropolitan area",
      "administrative headquarters",
      "Direct-administered municipality",
      "Prefecture-level city Sub-provincial city Ordinary prefectural city",
      "County-level city Sub-prefectural city Ordinary county city",
      "Special administrative region",
      "Core city",
      "Former special city",
      "City",
      "Special ward of Tokyo",
      "政令指定都市",
      "中核市",
      "特例市",
      "特別区",
      "直辖市",
      "副省级市",
      "县级市 副地级市 普通县级市",
      "特别行政区",
      "地级市 副省级市 普通地级市",
      "县级市",
      "副地级市",
      "普通县级市",
    ];

    // Helper function to check if a city name should be excluded
    function shouldExcludeCity(cityName) {
      const normalizedName = cityName.toLowerCase();
      if (
        normalizedName.endsWith(" city") ||
        normalizedName.startsWith("city ")
      ) {
        return true;
      }
      return excludedTerms.some((term) =>
        normalizedName.includes(term.toLowerCase()),
      );
    }

    // Helper function to extract population from a string
    function extractPopulation(text) {
      if (!text) return null;
      const numbers = text.match(/[\d,]+/g);
      if (numbers) {
        const possiblePop = parseInt(numbers[0].replace(/[,\s]/g, ""));
        if (possiblePop > 1000 && possiblePop < 100000000) {
          return possiblePop;
        }
      }
      return null;
    }

    const formattedCountryName = countryName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("_");

    const possibleUrls = [
      `List_of_cities_in_${formattedCountryName}_by_population`,
      `List_of_${formattedCountryName}_cities_by_population`,
      `List_of_cities_and_towns_in_${formattedCountryName}_by_population`,
      `List_of_cities_in_${formattedCountryName}`,
      `List_of_${formattedCountryName}_cities`,
      `List_of_cities_and_towns_in_${formattedCountryName}`,
    ];

    let html = null;
    for (const urlSuffix of possibleUrls) {
      try {
        const response = await axios.get(
          `https://en.wikipedia.org/wiki/${encodeURIComponent(urlSuffix)}`,
        );
        html = response.data;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!html) {
      throw new Error("Could not find a valid Wikipedia page for city list");
    }

    const $ = cheerio.load(html);
    const citiesArray = [];

    // Look for cities in tables
    $("table.wikitable, table.sortable").each((_, table) => {
      let populationColumnIndex = -1;

      // Try to find population column
      $(table)
        .find("th")
        .each((index, header) => {
          const headerText = $(header).text().toLowerCase().trim();
          if (
            headerText.includes("population") ||
            headerText.includes("demographic") ||
            headerText.includes("inhabitants")
          ) {
            populationColumnIndex = index;
          }
        });

      $(table)
        .find("tr")
        .each((i, row) => {
          if (i === 0) return; // Skip header row

          const cols = $(row).find("td");
          let cityName = null;
          let population = null;

          // Try to find city name in the first few columns
          for (let i = 0; i < Math.min(3, cols.length); i++) {
            // Get direct text content without any formatting or hidden elements
            let text = $(cols[i])
              .find("a") // Look for the actual city name link
              .first() // Take the first link if multiple exist
              .text() // Get its text
              .trim(); // Clean up whitespace

            // If no link found, try getting direct text
            if (!text) {
              text = $(cols[i])
                .clone() // Clone to avoid modifying original
                .find("*") // Find all elements
                .remove() // Remove them
                .end() // Go back to cloned element
                .text() // Get remaining text
                .trim(); // Clean up whitespace
            }

            if (
              text &&
              text.length > 1 &&
              !text.match(/^\d/) &&
              !shouldExcludeCity(text)
            ) {
              cityName = text;
              break;
            }
          }

          // If we found a valid city name and know where population data is
          if (cityName && populationColumnIndex >= 0) {
            const popText = $(cols[populationColumnIndex]).text().trim();
            population = extractPopulation(popText);
          }

          if (cityName) {
            citiesArray.push({
              name: cityName,
              population: population,
              country: countryName,
            });
          }
        });
    });

    // If no cities found in tables, try lists (without population data)
    if (citiesArray.length === 0) {
      $("ul li, ol li").each((_, item) => {
        const text = $(item).text().trim().split("[")[0].split("(")[0].trim();

        if (
          text &&
          text.length > 1 &&
          !text.match(/^\d/) &&
          !shouldExcludeCity(text)
        ) {
          citiesArray.push({
            name: text,
            population: null,
            country: countryName,
          });
        }
      });
    }

    // Sort by population if available, otherwise return unsorted
    const sortedCities = citiesArray
      .sort((a, b) => {
        if (a.population && b.population) {
          return b.population - a.population;
        }
        return 0; // Keep original order if population not available
      })
      .slice(0, 40)
      .map((city) => ({
        name: city.name,
        country: city.country,
      }));

    return sortedCities;
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
