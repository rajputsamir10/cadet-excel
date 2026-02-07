/**
 * AttendancePage Component
 * Track cadet attendance by date
 */

import React, { useState, useEffect } from 'react';
import { subscribeToCadets } from '../utils/firestoreCadetHelpers';
import { saveAttendance, getAttendanceForDate, saveAttendanceWithStatus } from '../utils/firestoreAttendanceHelpers';
import { exportAttendanceToExcel } from '../utils/excelExport';
import '../styles/AttendancePage.css';

const AttendancePage = ({ onBack }) => {
  const [cadets, setCadets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewResults, setViewResults] = useState([]);
  const [viewMessage, setViewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const STATUS_OPTIONS = [
    { value: 'P', label: 'Present', color: '#27ae60' },
    { value: 'A', label: 'Absent', color: '#e74c3c' },
    { value: 'R', label: 'Remarks', color: '#f39c12' },
    { value: 'M', label: 'Medical', color: '#3498db' },
    { value: 'C', label: 'Camp', color: '#9b59b6' }
  ];

  // Subscribe to real-time cadet updates from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCadets((loadedCadets) => {
      setCadets(loadedCadets);
      
      // Initialize attendance records for today
      const attendance = getAttendanceForDate(selectedDate);
      const records = loadedCadets.map(cadet => {
        const existing = attendance.records?.find(r => r.cadetId === cadet.id);
        return {
          cadetId: cadet.id,
          status: existing?.status || 'A'
        };
      });
      setAttendanceRecords(records);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Load attendance for selected date
  useEffect(() => {
    const loadAttendance = async () => {
      const attendance = await getAttendanceForDate(selectedDate);
      const records = cadets.map(cadet => {
        const existing = attendance.records?.find(r => r.cadetId === cadet.id);
        return {
          cadetId: cadet.id,
          status: existing?.status || 'A' // Default to Absent
        };
      });
      setAttendanceRecords(records);
      setMessage('');
    };
    
    if (cadets.length > 0) {
      loadAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, cadets]);

  // Filter cadets based on search
  const filteredCadets = cadets.filter(cadet => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cadet.fullName.toLowerCase().includes(searchLower) ||
      cadet.uniqueId.toLowerCase().includes(searchLower)
    );
  });

  // Handle status change
  const handleStatusChange = (cadetId, newStatus) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.cadetId === cadetId
          ? { ...record, status: newStatus }
          : record
      )
    );
  };

  // Set all to specific status
  const handleSetAllStatus = (status) => {
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, status }))
    );
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (cadets.length === 0) {
      setMessage('No cadets found. Please add cadets first.');
      return;
    }

    try {
      // Save using new format with status
      await saveAttendanceWithStatus(selectedDate, attendanceRecords);
      
      // Also save old format for backward compatibility
      const presentCadets = attendanceRecords
        .filter(r => r.status === 'P')
        .map(r => r.cadetId);
      await saveAttendance(selectedDate, presentCadets);
      
      const presentCount = attendanceRecords.filter(r => r.status === 'P').length;
      setMessage(`✓ Attendance saved for ${selectedDate} (${presentCount} present, ${attendanceRecords.length - presentCount} others)`);
    } catch (err) {
      setMessage('Error saving attendance: ' + err.message);
    }
  };

  // Export attendance
  const handleExportAttendance = () => {
    const presentCadetData = cadets.filter(c =>
      attendanceRecords.find(r => r.cadetId === c.uniqueId && r.status === 'P')
    );
    
    if (presentCadetData.length === 0) {
      setMessage('No cadets marked present. Please mark attendance first.');
      return;
    }

    exportAttendanceToExcel(presentCadetData, selectedDate);
  };

  // View attendance for a specific date
  const handleViewAttendance = async () => {
    try {
      const attendance = await getAttendanceForDate(viewDate);
      const records = attendance.records || [];

      if (records.length === 0) {
        setViewResults([]);
        setViewMessage('No attendance found for this date.');
        return;
      }

      const cadetDataWithStatus = cadets.map(cadet => ({
        ...cadet,
        status: records.find(r => r.cadetId === cadet.id)?.status || 'A'
      }));
      
      setViewResults(cadetDataWithStatus);
      setViewMessage('');
    } catch (err) {
      setViewMessage('Error loading attendance: ' + err.message);
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h1>Attendance Tracking</h1>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="attendance-controls">
        <div className="date-section">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="attendance-actions">
        <div className="quick-actions">
          <span className="quick-label">Mark All:</span>
          {STATUS_OPTIONS.map(option => (
            <button
              key={option.value}
              className="btn btn-quick-action"
              onClick={() => handleSetAllStatus(option.value)}
              title={option.label}
              style={{ backgroundColor: option.color, color: 'white' }}
            >
              {option.value}
            </button>
          ))}
        </div>

        <button
          className="btn btn-success"
          onClick={handleSaveAttendance}
        >
          Save Attendance
        </button>
        {attendanceRecords.length > 0 && (
          <button
            className="btn btn-primary"
            onClick={handleExportAttendance}
          >
            Export Excel
          </button>
        )}
      </div>

      <div className="attendance-table-wrapper">
        {loading ? (
          <div className="loading-state">
            <p>Loading cadets from cloud...</p>
          </div>
        ) : filteredCadets.length > 0 ? (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Name</th>
                <th>Regimental #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCadets.map(cadet => {
                const record = attendanceRecords.find(r => r.cadetId === cadet.id);
                const status = record?.status || 'A';
                const statusObj = STATUS_OPTIONS.find(s => s.value === status);
                
                return (
                  <tr key={cadet.id}>
                    <td className="id-cell">{cadet.uniqueId}</td>
                    <td>{cadet.fullName}</td>
                    <td>{cadet.regimentalNumber}</td>
                    <td className="status-cell">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(cadet.id, e.target.value)}
                        className="status-dropdown"
                        style={{ borderLeft: `4px solid ${statusObj?.color || '#ccc'}` }}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value} - {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : cadets.length === 0 ? (
          <div className="empty-state">
            <p>No cadets found. Please add cadets first.</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>No cadets match your search.</p>
          </div>
        )}
      </div>

      <div className="attendance-info">
        <div className="status-legend">
          {STATUS_OPTIONS.map(option => (
            <div key={option.value} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: option.color }}
              ></span>
              <span>{option.value} = {option.label}</span>
            </div>
          ))}
        </div>
        
        <p className="attendance-summary">
          {attendanceRecords.length} total cadets
          {' | '}
          <span style={{ color: '#27ae60' }}>
            {attendanceRecords.filter(r => r.status === 'P').length} Present
          </span>
          {' | '}
          <span style={{ color: '#e74c3c' }}>
            {attendanceRecords.filter(r => r.status === 'A').length} Absent
          </span>
          {' | '}
          <span style={{ color: '#f39c12' }}>
            {attendanceRecords.filter(r => r.status === 'R').length} Remarks
          </span>
          {' | '}
          <span style={{ color: '#3498db' }}>
            {attendanceRecords.filter(r => r.status === 'M').length} Medical
          </span>
          {' | '}
          <span style={{ color: '#9b59b6' }}>
            {attendanceRecords.filter(r => r.status === 'C').length} Camp
          </span>
        </p>
      </div>

      {/* View Attendance Section */}
      <div className="view-attendance-section">
        <h2>View Attendance by Date</h2>

        <div className="view-controls">
          <div className="date-section">
            <label>Select Date:</label>
            <input
              type="date"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
              className="date-input"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleViewAttendance}
          >
            View Attendance
          </button>
        </div>

        {viewMessage && <div className="alert alert-info">{viewMessage}</div>}

        {viewResults.length > 0 && (
          <>
            <div className="view-summary">
              <div className="status-legend">
                {STATUS_OPTIONS.map(option => {
                  const count = viewResults.filter(r => r.status === option.value).length;
                  return (
                    <div key={option.value} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: option.color }}
                      ></span>
                      <span>{option.label}: {count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="view-table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Unique ID</th>
                    <th>Name</th>
                    <th>Regimental #</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {viewResults.map(cadet => {
                    const statusObj = STATUS_OPTIONS.find(s => s.value === cadet.status);
                    return (
                      <tr key={cadet.uniqueId}>
                        <td className="id-cell">{cadet.uniqueId}</td>
                        <td>{cadet.fullName}</td>
                        <td>{cadet.regimentalNumber}</td>
                        <td className="status-cell">
                          <span
                            className="status-badge"
                            style={{ backgroundColor: statusObj?.color || '#ccc', color: 'white', padding: '4px 8px', borderRadius: '4px' }}
                          >
                            {cadet.status} - {statusObj?.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
