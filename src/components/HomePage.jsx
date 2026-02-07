/**
 * HomePage Component
 * Landing page with navigation to Add Cadet and Attendance
 */

import React from 'react';
import '../styles/HomePage.css';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <h1>Cadet Management System</h1>
          <p className="welcome-text">
            Manage cadets and track attendance with ease
          </p>

          <div className="navigation-buttons">
            <button
              className="nav-button nav-button-primary"
              onClick={() => onNavigate('add-cadet')}
            >
              <span className="button-icon">➕</span>
              <span className="button-text">Add Cadet</span>
            </button>

            <button
              className="nav-button nav-button-secondary"
              onClick={() => onNavigate('attendance')}
            >
              <span className="button-icon">📋</span>
              <span className="button-text">Attendance</span>
            </button>

            <button
              className="nav-button nav-button-tertiary"
              onClick={() => onNavigate('monthly-attendance')}
            >
              <span className="button-icon">📊</span>
              <span className="button-text">Monthly Report</span>
            </button>
          </div>

          <div className="info-box">
            <h3>Quick Info</h3>
            <ul>
              <li>✓ Add new cadets with unique IDs</li>
              <li>✓ Track attendance by date</li>
              <li>✓ Export attendance to Excel</li>
              <li>✓ All data stored locally (no internet needed)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
