/**
 * CadetManager Component
 * Handles form submission, cadet management, and table display
 * Now synced with Firebase Firestore for cloud persistence
 */

import React, { useState, useEffect } from 'react';
import { subscribeToCadets, addCadet, updateCadet, deleteCadet, generateUniqueId } from '../utils/firestoreCadetHelpers';
import { exportToExcel } from '../utils/excelExport';
import '../styles/CadetManager.css';

const CadetManager = ({ onBack }) => {
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
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editingRegimentalNumber, setEditingRegimentalNumber] = useState(null);

  // Subscribe to real-time cadet updates from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCadets((updatedCadets) => {
      // CLEAN OLD DUPLICATES: Remove duplicates based on regimentalNumber
      const uniqueCadets = [];
      const seenRegNumbers = new Set();
      
      updatedCadets.forEach(cadet => {
        // Keep only first occurrence of each regimental number
        if (!seenRegNumbers.has(cadet.regimentalNumber)) {
          seenRegNumbers.add(cadet.regimentalNumber);
          uniqueCadets.push(cadet);
        }
      });
      
      setCadets(uniqueCadets);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
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

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
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
      if (editMode) {
        // EDIT MODE: Allow save only if regimentalNumber unchanged or new number doesn't exist
        const regNumberChanged = editingRegimentalNumber !== formData.regimentalNumber;
        
        if (regNumberChanged) {
          // Check if new regimental number already exists in OTHER records
          const duplicateExists = cadets.find(
            c => c.regimentalNumber === formData.regimentalNumber && 
                 c.regimentalNumber !== editingRegimentalNumber
          );
          
          if (duplicateExists) {
            setError('Cadet with this Regimental Number already exists.');
            return;
          }
        }

        // Find the cadet to update by original regimental number
        const cadetToUpdate = cadets.find(c => c.regimentalNumber === editingRegimentalNumber);
        if (!cadetToUpdate || !cadetToUpdate.id) {
          setError('Cadet not found');
          return;
        }

        // Generate new uniqueId if gender or regimentalNumber changed
        const uniqueId = generateUniqueId(formData.gender, formData.regimentalNumber);

        // Update cadet in Firestore
        await updateCadet(cadetToUpdate.id, {
          ...formData,
          uniqueId,
        });

        setSuccess(`Cadet ${formData.fullName} updated successfully`);
        setEditMode(false);
        setEditingRegimentalNumber(null);
      } else {
        // ADD MODE: Check if regimentalNumber already exists
        const duplicateByRegNumber = cadets.find(
          c => c.regimentalNumber === formData.regimentalNumber
        );
        
        // REGIMENTAL NUMBER MUST BE UNIQUE
        if (duplicateByRegNumber) {
          setError('Cadet with this Regimental Number already exists.');
          return;
        }

        // Generate unique ID
        const uniqueId = generateUniqueId(formData.gender, formData.regimentalNumber);

        // Create cadet object
        const newCadet = {
          uniqueId,
          ...formData,
        };

        // Add cadet to Firestore (Firebase auto-generates internal ID)
        await addCadet(newCadet);
        setSuccess(`Cadet ${newCadet.fullName} added with ID: ${uniqueId}`);
      }

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

  // EDIT CADET: Load cadet data into form for editing
  const handleEditCadet = (regimentalNumber) => {
    const cadet = cadets.find(c => c.regimentalNumber === regimentalNumber);
    if (cadet) {
      setFormData({
        fullName: cadet.fullName,
        gender: cadet.gender,
        regimentalNumber: cadet.regimentalNumber,
        phone: cadet.phone,
        email: cadet.email,
        universityRollNumber: cadet.universityRollNumber || '',
        department: cadet.department || '',
        dateOfBirth: cadet.dateOfBirth || '',
        fatherName: cadet.fatherName || '',
      });
      setEditMode(true);
      setEditingRegimentalNumber(regimentalNumber);
      setError('');
      setSuccess('');
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingRegimentalNumber(null);
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
    setError('');
    setSuccess('');
  };

  // USE REGIMENTAL NUMBER AS PRIMARY KEY: Handle checkbox selection
  const handleSelectCadet = (regimentalNumber) => {
    setSelectedCadets(prev => {
      if (prev.includes(regimentalNumber)) {
        return prev.filter(num => num !== regimentalNumber);
      } else {
        return [...prev, regimentalNumber];
      }
    });
  };

  // Handle select all using regimentalNumber
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCadets(cadets.map(c => c.regimentalNumber));
    } else {
      setSelectedCadets([]);
    }
  };

  // DELETE USING REGIMENTAL NUMBER: Delete selected cadets by regimentalNumber
  const handleDeleteSelected = async () => {
    if (selectedCadets.length === 0) {
      setError('Please select at least one cadet to delete');
      return;
    }

    if (window.confirm(`Delete ${selectedCadets.length} cadet(s)?`)) {
      try {
        // Find Firebase IDs for selected regimental numbers and delete
        for (const regimentalNumber of selectedCadets) {
          const cadet = cadets.find(c => c.regimentalNumber === regimentalNumber);
          if (cadet && cadet.id) {
            await deleteCadet(cadet.id); // Delete from Firestore using Firebase ID
          }
        }
        setSelectedCadets([]);
        setSuccess('Cadets deleted successfully');
      } catch (err) {
        setError('Error deleting cadets: ' + err.message);
      }
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    exportToExcel(cadets, selectedCadets);
  };

  // DELETE USING REGIMENTAL NUMBER: Handle delete single cadet
  const handleDeleteCadet = async (regimentalNumber) => {
    if (window.confirm('Delete this cadet?')) {
      try {
        // Find the cadet by regimentalNumber to get Firebase ID
        const cadet = cadets.find(c => c.regimentalNumber === regimentalNumber);
        if (cadet && cadet.id) {
          await deleteCadet(cadet.id); // Delete from Firestore using Firebase ID
          setSelectedCadets(prev => prev.filter(num => num !== regimentalNumber));
          setSuccess('Cadet deleted successfully');
        } else {
          setError('Cadet not found');
        }
      } catch (err) {
        setError('Error deleting cadet: ' + err.message);
      }
    }
  };

  return (
    <div className="cadet-manager">
      <h1>Cadet Management System</h1>

      {onBack && (
        <button className="btn-back" onClick={onBack}>← Back</button>
      )}

      {/* Form Section */}
      <div className="form-section">
        <h2>{editMode ? 'Edit Cadet' : 'Add New Cadet'}</h2>
        {editMode && (
          <div className="alert alert-info" style={{marginBottom: '10px'}}>
            Editing: {editingRegimentalNumber}
          </div>
        )}

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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editMode ? 'Update Cadet' : 'Add Cadet'}
            </button>
            {editMode && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancelEdit}
                style={{marginLeft: '10px'}}
              >
                Cancel
              </button>
            )}
          </div>
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

        {loading ? (
          <div className="loading-state">
            <p>Loading cadets from cloud...</p>
          </div>
        ) : cadets.length > 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* USE REGIMENTAL NUMBER AS PRIMARY KEY */}
                {cadets.map(cadet => (
                  <tr key={cadet.regimentalNumber}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCadets.includes(cadet.regimentalNumber)}
                        onChange={() => handleSelectCadet(cadet.regimentalNumber)}
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
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEditCadet(cadet.regimentalNumber)}
                        style={{marginRight: '5px'}}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteCadet(cadet.regimentalNumber)}
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
