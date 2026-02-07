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
