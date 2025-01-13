import React from "react";
import MenuPage from "./pages/landingPage/MenuPage";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./auth/authContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MenuPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
