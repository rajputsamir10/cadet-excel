# Cadet Management System - Setup Guide

## Installation & Setup

### 1. Install XLSX (SheetJS) Package

Run this command in your project root:

```bash
npm install xlsx
```

Or if using yarn:

```bash
yarn add xlsx
```

### 2. File Structure

Place all files in the correct directories:

```
src/
├── components/
│   └── CadetManager.jsx
├── utils/
│   ├── localStorageHelpers.js
│   ├── idGenerator.js
│   └── excelExport.js
├── styles/
│   └── CadetManager.css
├── App.jsx
├── App.css
└── index.js
```

### 3. What Each File Does

#### `CadetManager.jsx`
- Main component with form and table
- Manages state for cadets and selected items
- Handles form submission, validation, deletion
- Displays cadets in a table with checkboxes

#### `localStorageHelpers.js`
- Saves/retrieves cadet data from LocalStorage
- Manages ID counters (SD/SW)
- Provides helper functions for data persistence

#### `idGenerator.js`
- Generates unique IDs (SD1, SD2, SW1, SW2, etc.)
- Determines ID type based on gender & regimental number
- Increments counters separately for SD and SW

#### `excelExport.js`
- Exports selected cadets to Excel file
- Uses XLSX library
- Filename: `attendance_YYYY_MM_DD.xlsx`
- Auto downloads with proper formatting

#### `CadetManager.css`
- Clean, minimal styling
- Responsive design for mobile/tablet
- Smooth transitions and hover effects

## Features

### Form Validation
- Checks for required fields (Name, Regimental Number, Phone, Email)
- Prevents duplicate Regimental Numbers
- Clear error messages

### Unique ID Generation
- **Male** → SD series (SD1, SD2, SD3...)
- **Female** → SW series (SW1, SW2, SW3...)
- Override based on Regimental Number containing "SD" or "SW"
- Counters stored in LocalStorage

### Cadet Table
- Sortable rows with checkboxes
- Select all / Select individual
- Delete single or multiple cadets
- Responsive table on mobile devices

### Excel Export
- Export selected cadets only
- Proper column widths for readability
- Headers: Unique ID, Name, Regimental Number, Phone, Email, Roll Number, Department, DOB, Father Name
- Filename with date: `attendance_2026_02_07.xlsx`

## How to Use

1. **Add a Cadet**: Fill the form and click "Add Cadet"
2. **View List**: All cadets appear in the table below
3. **Select Cadets**: Check the boxes next to cadets
4. **Export**: Click "Export to Excel" button (only appears when cadets are selected)
5. **Delete**: Click "Delete" button per row, or select multiple and use "Delete Selected"

## LocalStorage Keys

The system uses these LocalStorage keys:
- `cadets` - Array of all cadet objects
- `sdCounter` - Counter for SD IDs
- `swCounter` - Counter for SW IDs

## Testing in Browser

1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. View the data being saved automatically
4. Add/delete cadets to see changes in real-time

## Notes

- All data is stored locally in the browser
- Data persists across page refreshes
- Each browser has its own independent data
- Clear browser data will delete all cadets
- No backend server required
- Works offline once loaded

---

**Next Step**: Deploy to Vercel (see Vercel deployment guide)
