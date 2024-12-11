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

    // Find country in infobox
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
      });

    // Find population with improved priority for city population
    let foundPopulationSection = false;
    $(".infobox")
      .find("tr")
      .each((i, row) => {
        const label = $(row).find("th").text().toLowerCase().trim();

        if (label === "population") {
          foundPopulationSection = true;
          return;
        }

        if (foundPopulationSection) {
          const sublabel = $(row).find("th").text().toLowerCase().trim();
          const value = $(row).find("td").text().trim().toLowerCase();
          const hasNumbers = value.match(/[\d,]+/);

          // Only skip if we have both numbers and area units
          const isArea =
            hasNumbers &&
            (value.includes("km²") ||
              value.includes("km2") ||
              value.includes("sq mi"));
          if (isArea) {
            return;
          }

          // Check for Total, City, or plain numeric population, excluding density values
          if (
            (sublabel.includes("total") ||
              sublabel.includes("city") ||
              (hasNumbers && !sublabel.includes("density"))) &&
            !population
          ) {
            // Extract numbers, handling cases with years in parentheses
            const popMatch = value.match(/[\d,]+/);
            if (popMatch) {
              const possiblePop = parseInt(popMatch[0].replace(/[,\s]/g, ""));
              // Basic validation: population should be a reasonable number
              if (possiblePop > 1000 && possiblePop < 100000000) {
                population = possiblePop;
              }
            }
          }

          // Exit population section if we hit a clearly different section
          if (
            label &&
            !label.includes("city") &&
            !label.includes("total") &&
            !label.includes("density") &&
            !label.includes("rank") &&
            !label.includes("population")
          ) {
            foundPopulationSection = false;
          }
        }
      });

    // If still no population found, try metro population as fallback
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
            // Only skip if we have both numbers and area units
            const isArea =
              hasNumbers &&
              (value.includes("km²") ||
                value.includes("km2") ||
                value.includes("sq mi"));
            if (isArea) {
              return;
            }

            // Make sure we're not getting GDP values
            if (
              !value.includes("€") &&
              !value.includes("$") &&
              !value.includes("billion") &&
              !value.includes("gdp")
            ) {
              const popMatch = value.match(/[\d,]+/);
              if (popMatch) {
                const possiblePop = parseInt(popMatch[0].replace(/[,\s]/g, ""));
                // Basic validation
                if (possiblePop > 1000 && possiblePop < 100000000) {
                  population = possiblePop;
                }
              }
            }
          }
        });
    }

    // Get coordinates (unchanged)
    const parseDMS = (dms) => {
      // Try full format (deg, min, sec)
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

      // Try shorter format (deg, min only)
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
