/**
 * Excel Export Handler
 * Uses XLSX (SheetJS) to export cadet data
 */

import * as XLSX from 'xlsx';

/**
 * Export selected cadets to Excel
 * @param {Array} cadets - Array of cadet objects
 * @param {Array} selectedIds - Array of unique IDs of selected cadets
 */
export const exportToExcel = (cadets, selectedIds) => {
  // Filter cadets by selected IDs
  const selectedCadets = cadets.filter(cadet => selectedIds.includes(cadet.uniqueId));

  if (selectedCadets.length === 0) {
    alert('Please select at least one cadet to export');
    return;
  }

  // Prepare data for Excel with column order
  const excelData = selectedCadets.map(cadet => ({
    'Unique ID': cadet.uniqueId,
    'Name': cadet.fullName,
    'Regimental Number': cadet.regimentalNumber,
    'Phone': cadet.phone,
    'Email': cadet.email,
    'University Roll': cadet.universityRollNumber,
    'Department': cadet.department,
    'DOB': cadet.dateOfBirth,
    'Father Name': cadet.fatherName,
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cadets');

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 }, // Unique ID
    { wch: 20 }, // Name
    { wch: 20 }, // Regimental Number
    { wch: 12 }, // Phone
    { wch: 25 }, // Email
    { wch: 15 }, // University Roll
    { wch: 15 }, // Department
    { wch: 12 }, // DOB
    { wch: 20 }, // Father Name
  ];
  worksheet['!cols'] = columnWidths;

  // Generate filename with current date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const filename = `attendance_${year}_${month}_${day}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
};

/**
 * Export attendance to Excel
 * @param {Array} cadets - Array of present cadet objects
 * @param {String} date - Attendance date (YYYY-MM-DD)
 */
export const exportAttendanceToExcel = (cadets, date) => {
  if (cadets.length === 0) {
    alert('No cadets to export');
    return;
  }

  // Prepare data for Excel with column order
  const excelData = cadets.map(cadet => ({
    'Unique ID': cadet.uniqueId,
    'Name': cadet.fullName,
    'Regimental Number': cadet.regimentalNumber,
    'Phone': cadet.phone,
    'Email': cadet.email,
    'University Roll': cadet.universityRollNumber,
    'Department': cadet.department,
    'DOB': cadet.dateOfBirth,
    'Father Name': cadet.fatherName,
    'Attendance Date': date,
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Unique ID
    { wch: 20 }, // Name
    { wch: 20 }, // Regimental Number
    { wch: 12 }, // Phone
    { wch: 25 }, // Email
    { wch: 15 }, // University Roll
    { wch: 15 }, // Department
    { wch: 12 }, // DOB
    { wch: 20 }, // Father Name
    { wch: 15 }, // Attendance Date
  ];
  worksheet['!cols'] = columnWidths;

  // Generate filename
  const [year, month, day] = date.split('-');
  const filename = `attendance_${year}_${month}_${day}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
};

/**
 * Export monthly/consolidated attendance to Excel
 * Creates matrix: Cadets vs Dates with attendance status
 * @param {Array} matrixData - Matrix with cadet data and attendance
 * @param {Array} dateRange - Array of dates (YYYY-MM-DD)
 * @param {String} fromDate - Start date
 * @param {String} toDate - End date
 */
export const exportMonthlyAttendanceToExcel = (matrixData, dateRange, fromDate, toDate) => {
  if (matrixData.length === 0 || dateRange.length === 0) {
    alert('No data to export');
    return;
  }

  // Prepare data for Excel
  const excelData = matrixData.map(row => {
    const excelRow = {
      'Unique ID': row.uniqueId,
      'Name': row.name,
    };

    // Add attendance for each date
    dateRange.forEach(date => {
      excelRow[date] = row.attendance[date] || 'A';
    });

    // Add total present count
    excelRow['Total Present'] = row.totalPresent;

    return excelRow;
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Attendance');

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // ID
    { wch: 25 }, // Name
  ];

  // Add widths for date columns
  dateRange.forEach(() => {
    columnWidths.push({ wch: 6 }); // Narrow columns for dates
  });

  columnWidths.push({ wch: 12 }); // Total Present

  worksheet['!cols'] = columnWidths;

  // Format header row (freeze panes for better visibility)
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  worksheet['!freeze'] = { xSplit: 2, ySplit: 1 };

  // Generate filename
  const fromFormatted = fromDate.replace(/-/g, '_');
  const toFormatted = toDate.replace(/-/g, '_');
  const filename = `monthly_attendance_${fromFormatted}_${toFormatted}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
};
