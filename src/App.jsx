/**
 * App.jsx
 * Main app with navigation between pages
 */

import React, { useState } from "react";
import HomePage from "./components/HomePage";
import CadetManager from "./components/CadetManager";
import AttendancePage from "./components/AttendancePage";
import MonthlyAttendance from "./components/MonthlyAttendance";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage("home");
  };

  return (
    <div className="App">
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "add-cadet" && <CadetManager onBack={handleBack} />}
      {currentPage === "attendance" && <AttendancePage onBack={handleBack} />}
      {currentPage === "monthly-attendance" && <MonthlyAttendance onBack={handleBack} />}
    </div>
  );
}

export default App;
