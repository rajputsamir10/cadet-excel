/**
 * CadetManager Component
 * Handles form submission, cadet management, and table display
 */

import React, { useState, useEffect } from 'react';
import { getCadets, addCadet, deleteCadet } from '../utils/localStorageHelpers';
import { generateUniqueId } from '../utils/idGenerator';
import { exportToExcel } from '../utils/excelExport';
import '../styles/CadetManager.css';

const CadetManager = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    regimentalNumber: '',
    phone: '',
    email: '',
    universityRollNumber: '',
    department: '',
    dateOfBirth: '',
    fatherName: '',
  });

  const [cadets, setCadets] = useState([]);
  const [selectedCadets, setSelectedCadets] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load cadets from LocalStorage on component mount
  useEffect(() => {
    const loadedCadets = getCadets();
    setCadets(loadedCadets);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (!formData.regimentalNumber.trim()) {
      setError('Regimental Number is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      // Generate unique ID
      const uniqueId = generateUniqueId(formData.gender, formData.regimentalNumber);

      // Create cadet object
      const newCadet = {
        uniqueId,
        ...formData,
      };

      // Add cadet and update state
      const updatedCadets = addCadet(newCadet);
      setCadets(updatedCadets);
      setSuccess(`Cadet ${newCadet.fullName} added with ID: ${uniqueId}`);

      // Reset form
      setFormData({
        fullName: '',
        gender: 'Male',
        regimentalNumber: '',
        phone: '',
        email: '',
        universityRollNumber: '',
        department: '',
        dateOfBirth: '',
        fatherName: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle checkbox selection
  const handleSelectCadet = (uniqueId) => {
    setSelectedCadets(prev => {
      if (prev.includes(uniqueId)) {
        return prev.filter(id => id !== uniqueId);
      } else {
        return [...prev, uniqueId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCadets(cadets.map(c => c.uniqueId));
    } else {
      setSelectedCadets([]);
    }
  };

  // Handle delete selected
  const handleDeleteSelected = () => {
    if (selectedCadets.length === 0) {
      setError('Please select at least one cadet to delete');
      return;
    }

    if (window.confirm(`Delete ${selectedCadets.length} cadet(s)?`)) {
      const updatedCadets = cadets.filter(
        cadet => !selectedCadets.includes(cadet.uniqueId)
      );
      updatedCadets.forEach(cadet => {
        if (!cadets.some(c => c.uniqueId === cadet.uniqueId)) {
          deleteCadet(cadet.uniqueId);
        }
      });
      setCadets(updatedCadets);
      setSelectedCadets([]);
      setSuccess('Cadets deleted successfully');
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    exportToExcel(cadets, selectedCadets);
  };

  // Handle delete single cadet
  const handleDeleteCadet = (uniqueId) => {
    if (window.confirm('Delete this cadet?')) {
      const updatedCadets = deleteCadet(uniqueId);
      setCadets(updatedCadets);
      setSelectedCadets(prev => prev.filter(id => id !== uniqueId));
      setSuccess('Cadet deleted successfully');
    }
  };

  return (
    <div className="cadet-manager">
      <h1>Cadet Management System</h1>

      {/* Form Section */}
      <div className="form-section">
        <h2>Add New Cadet</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Regimental Number *</label>
              <input
                type="text"
                name="regimentalNumber"
                value={formData.regimentalNumber}
                onChange={handleInputChange}
                placeholder="e.g., SD-001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>University Roll Number</label>
              <input
                type="text"
                name="universityRollNumber"
                value={formData.universityRollNumber}
                onChange={handleInputChange}
                placeholder="Roll number"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Father's name"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Cadet
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <h2>Cadets ({cadets.length})</h2>
          <div className="action-buttons">
            {selectedCadets.length > 0 && (
              <>
                <button
                  className="btn btn-success"
                  onClick={handleExportExcel}
                >
                  Export to Excel ({selectedCadets.length})
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </div>

        {cadets.length > 0 ? (
          <div className="table-wrapper">
            <table className="cadets-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        cadets.length > 0 &&
                        selectedCadets.length === cadets.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Unique ID</th>
                  <th>Name</th>
                  <th>Regimental #</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Roll #</th>
                  <th>Department</th>
                  <th>DOB</th>
                  <th>Father Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cadets.map(cadet => (
                  <tr key={cadet.uniqueId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCadets.includes(cadet.uniqueId)}
                        onChange={() => handleSelectCadet(cadet.uniqueId)}
                      />
                    </td>
                    <td className="bold">{cadet.uniqueId}</td>
                    <td>{cadet.fullName}</td>
                    <td>{cadet.regimentalNumber}</td>
                    <td>{cadet.phone}</td>
                    <td className="email">{cadet.email}</td>
                    <td>{cadet.universityRollNumber}</td>
                    <td>{cadet.department}</td>
                    <td>{cadet.dateOfBirth}</td>
                    <td>{cadet.fatherName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteCadet(cadet.uniqueId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No cadets added yet. Add a cadet using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadetManager;
