/**
 * MonthlyAttendance Component
 * Generate consolidated attendance report for date range
 * Shows matrix: Cadets vs Dates with attendance status
 * Cloud-synced via Firebase Firestore
 */

import React, { useState, useEffect } from 'react';
import { subscribeToCadets } from '../utils/firestoreCadetHelpers';
import { getAttendanceByDateRange } from '../utils/firestoreAttendanceHelpers';
import { exportMonthlyAttendanceToExcel } from '../utils/excelExport';
import '../styles/MonthlyAttendance.css';

const MonthlyAttendance = ({ onBack }) => {
  const [cadets, setCadets] = useState([]);
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [matrixData, setMatrixData] = useState([]);
  const [message, setMessage] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time cadet updates from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCadets((loadedCadets) => {
      setCadets(loadedCadets);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Get first day of current month
  function getFirstDayOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  // Generate attendance report
  const handleGenerateReport = async () => {
    setMessage('');
    setMatrixData([]);
    setDateRange([]);

    // Validate dates
    if (fromDate > toDate) {
      setMessage('From Date must be before To Date');
      return;
    }

    if (cadets.length === 0) {
      setMessage('No cadets found. Please add cadets first.');
      return;
    }

    try {
      // Get attendance records for date range from Firestore
      const records = await getAttendanceByDateRange(fromDate, toDate);

      // Generate date array (all dates in range)
      const dates = generateDateRange(fromDate, toDate);
      setDateRange(dates);

      // Handle no records
      if (records.length === 0) {
        setMessage(`No attendance records found between ${fromDate} and ${toDate}`);
        return;
      }

      // Create matrix data
      const matrix = createAttendanceMatrix(cadets, dates, records);
      setMatrixData(matrix);
      setMessage(`Report generated for ${dates.length} days, ${cadets.length} cadets`);
    } catch (err) {
      setMessage('Error generating report: ' + err.message);
    }
  };

  // Generate array of dates between two dates
  function generateDateRange(start, end) {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  // Create matrix: Cadets x Dates with status
  function createAttendanceMatrix(cadets, dates, records) {
    return cadets.map(cadet => {
      const row = {
        uniqueId: cadet.uniqueId,
        name: cadet.fullName,
        attendance: {},
        totalPresent: 0,
      };

      // For each date, get cadet's status
      dates.forEach(date => {
        const dateRecord = records.find(r => r.date === date);
        let status = 'A'; // Default Absent

        if (dateRecord && dateRecord.records) {
          const cadetRecord = dateRecord.records.find(r => r.cadetId === cadet.id);
          if (cadetRecord) {
            status = cadetRecord.status;
          }
        }

        row.attendance[date] = status;

        // Count present
        if (status === 'P') {
          row.totalPresent++;
        }
      });

      return row;
    });
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (matrixData.length === 0) {
      setMessage('Please generate report first');
      return;
    }

    exportMonthlyAttendanceToExcel(matrixData, dateRange, fromDate, toDate);
  };

  return (
    <div className="monthly-attendance-page">
      <div className="attendance-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h1>Monthly Attendance Report</h1>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Controls */}
      <div className="report-controls">
        <div className="date-group">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="date-group">
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="date-input"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>

        {matrixData.length > 0 && (
          <button
            className="btn btn-success"
            onClick={handleExportExcel}
          >
            Export to Excel
          </button>
        )}
      </div>

      {/* Matrix Table */}
      {matrixData.length > 0 && dateRange.length > 0 && (
        <div className="matrix-wrapper">
          <div className="matrix-table-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  {dateRange.map(date => (
                    <th key={date} className="date-header">
                      {date.split('-')[2]}
                    </th>
                  ))}
                  <th>Total P</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="id-cell">{row.uniqueId}</td>
                    <td className="name-cell">{row.name}</td>
                    {dateRange.map(date => (
                      <td
                        key={`${row.uniqueId}-${date}`}
                        className={`status-cell status-${row.attendance[date]}`}
                      >
                        {row.attendance[date]}
                      </td>
                    ))}
                    <td className="total-cell">{row.totalPresent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="legend">
            <p>
              <strong>Legend:</strong>
              <span className="legend-item">P = Present</span>
              <span className="legend-item">A = Absent</span>
              <span className="legend-item">R = Remarks</span>
              <span className="legend-item">M = Medical</span>
              <span className="legend-item">C = Camp</span>
            </p>
          </div>
        </div>
      )}

      {matrixData.length === 0 && dateRange.length === 0 && !message && (
        <div className="empty-state">
          <p>Select date range and click "Generate Report" to view attendance matrix</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendance;
