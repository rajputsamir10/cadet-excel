/**
 * Attendance Helpers
 * Manage attendance records in LocalStorage
 */

const ATTENDANCE_KEY = 'attendance';

/**
 * Get all attendance records
 */
export const getAllAttendance = () => {
  try {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading attendance:', error);
    return [];
  }
};

/**
 * Save attendance for a specific date
 */
export const saveAttendance = (date, presentCadetIds) => {
  try {
    const allAttendance = getAllAttendance();

    // Find if attendance for this date already exists
    const existingIndex = allAttendance.findIndex(a => a.date === date);

    const attendanceRecord = {
      date,
      presentCadets: presentCadetIds,
      savedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing attendance
      allAttendance[existingIndex] = attendanceRecord;
    } else {
      // Add new attendance
      allAttendance.push(attendanceRecord);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(allAttendance));
    return attendanceRecord;
  } catch (error) {
    console.error('Error saving attendance:', error);
  }
};

/**
 * Get attendance for a specific date
 */
export const getAttendanceForDate = (date) => {
  const allAttendance = getAllAttendance();
  return allAttendance.find(a => a.date === date) || { date, presentCadets: [] };
};

/**
 * Delete attendance for a specific date
 */
export const deleteAttendance = (date) => {
  try {
    const allAttendance = getAllAttendance();
    const filtered = allAttendance.filter(a => a.date !== date);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting attendance:', error);
  }
};

/**
 * Get attendance summary for date range
 */
export const getAttendanceSummary = (startDate, endDate) => {
  const allAttendance = getAllAttendance();
  return allAttendance.filter(a => a.date >= startDate && a.date <= endDate);
};

/**
 * Save attendance with status for a specific date
 * New format: { date, records: [{ cadetId, status }] }
 * Statuses: P (Present), A (Absent), R (Remarks), M (Medical), C (Camp)
 */
export const saveAttendanceWithStatus = (date, statusRecords) => {
  try {
    const allAttendance = getAllAttendance();
    const existingIndex = allAttendance.findIndex(a => a.date === date);

    const attendanceRecord = {
      date,
      records: statusRecords,
      savedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      allAttendance[existingIndex] = attendanceRecord;
    } else {
      allAttendance.push(attendanceRecord);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(allAttendance));
    return attendanceRecord;
  } catch (error) {
    console.error('Error saving attendance with status:', error);
  }
};

/**
 * Get attendance records for a date range
 */
export const getAttendanceByDateRange = (startDate, endDate) => {
  const allAttendance = getAllAttendance();
  return allAttendance.filter(a => a.date >= startDate && a.date <= endDate);
};

/**
 * Get status of a cadet on a specific date
 * Returns: P, A, R, M, C, or A (default)
 */
export const getCadetStatusOnDate = (cadetId, date, allAttendance) => {
  const dateRecord = allAttendance.find(a => a.date === date);
  if (!dateRecord) return 'A';

  // Handle new format (records with status)
  if (dateRecord.records) {
    const cadetRecord = dateRecord.records.find(r => r.cadetId === cadetId);
    return cadetRecord ? cadetRecord.status : 'A';
  }

  // Handle old format (presentCadets array)
  if (dateRecord.presentCadets) {
    return dateRecord.presentCadets.includes(cadetId) ? 'P' : 'A';
  }

  return 'A';
};
