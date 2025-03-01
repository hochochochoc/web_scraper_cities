# GeoCities Webscraper

GeoCities Webscraper is a web application for searching, scraping, and storing geographic data about cities worldwide.

## Overview

GeoCities Webscraper is a web application that allows users to search, scrape, and store geographic data about cities around the world. The application combines Google Maps integration with a custom backend scraper that retrieves city information from Wikipedia, enabling users to build a personalized database of geographic locations.

## Features

- Search for countries and view their cities
- Web scrape detailed city information from Wikipedia
- Real-time validation of city data before adding to database
- Interactive maps showing city locations
- Edit city details (name, country, region, population, coordinates)
- Flag potential duplicate or nearby cities to prevent database errors
- Firebase integration for data persistence

## Project Structure

```
── backend/             # Express server for web scraping
│ ├── server.js         # Server implementation with scraping logic
│ └── package.json      # Backend dependencies
├── public/             # Static assets
├── src/
│ ├── auth/             # Authentication components
│ ├── components/       # Reusable UI components
│ ├── context/          # React context providers
│ ├── firebase/         # Firebase configuration
│ ├── i18n/             # Internationalization setup
│ ├── lib/              # Utility functions
│ ├── pages/            # Page components
│ │ └── landingPage/    # Main application page
│ │ └── components/
│ │ ├── header/         # Header components
│ │ ├── maps/           # Map visualization components
│ │ ├── maptest/        # Google Maps integration
│ │ ├── scaper/         # Scraper interface components
│ │ └── sidebar/        # Sidebar navigation
│ ├── App.jsx           # Main application component
│ └── main.jsx          # Application entry point
└── package.json        # Frontend dependencies
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account for database
- Google Maps API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Database Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore database
3. Set up Authentication with Email/Password method
4. Create a collection named cities in Firestore
5. Update the Firebase configuration in src/firebase/firebase.jsx with your project details

### Installation Steps

1. Clone the repository:

   ```
   Copygit clone https://github.com/yourusername/geocities-webscraper.git
   cd geocities-webscraper
   ```

2. Install frontend dependencies:

   ```
   npm install
   ```

3. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

4. Start the backend server:

   ```
   npm start
   ```

5. In a separate terminal, start the frontend development server:
   ```
   cd ..
   npm run dev
   ```

## Usage

1. Access the application at http://localhost:5173
2. Enter a country name in the search bar
3. Select a city from the list to fetch its details
4. Review and edit city information if needed
5. Click "Submit" to add the city to the pending approval list
6. Review cities in the pending list and click "Save to 7.Database" when ready
7. View all saved cities in the Database panel
8. Toggle the map view to visualize the cities' locations
